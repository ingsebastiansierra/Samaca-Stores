import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  // Obtener categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('name')

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Nuevo Producto</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Agrega un nuevo producto a tu inventario</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
