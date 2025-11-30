import { createClient } from '@/lib/supabase/server'
import { CatalogGenerator } from '@/components/admin/catalog/CatalogGenerator'
import { redirect } from 'next/navigation'

export default async function CatalogPDFPage() {
    const supabase = await createClient()

    // Verificar sesión
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Obtener tienda del usuario
    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!store) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold text-red-600">No se encontró la tienda</h2>
                <p className="text-gray-600 mt-2">Asegúrate de tener una tienda configurada asociada a tu cuenta.</p>
            </div>
        )
    }

    // Obtener productos
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pt-20 md:pt-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Generador de Catálogos PDF</h1>
                <p className="text-gray-500">Selecciona los productos que quieres incluir en tu catálogo personalizado para enviar por WhatsApp.</p>
            </div>

            <CatalogGenerator
                products={products || []}
                storeName={store.name}
                storePhone={store.phone || store.whatsapp}
            />
        </div>
    )
}
