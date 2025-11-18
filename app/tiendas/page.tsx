import { createClient } from '@/lib/supabase/server'
import { StoresGrid } from '@/components/stores/StoresGrid'

export default async function TiendasPage() {
  const supabase = await createClient()

  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Nuestras Tiendas
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Descubre los mejores locales comerciales de Samacá, Boyacá
          </p>
        </div>
      </section>

      {/* Stores Grid */}
      <StoresGrid stores={stores || []} />
    </div>
  )
}
