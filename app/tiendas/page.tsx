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
      <section className="py-16 sm:py-20 md:py-24 px-4 bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
            Nuestras Tiendas
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
            Descubre los mejores locales comerciales de Samacá, Boyacá
          </p>
        </div>
      </section>

      {/* Stores Grid */}
      <StoresGrid stores={stores || []} />
    </div>
  )
}
