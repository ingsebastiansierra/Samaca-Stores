import Link from 'next/link'
import { getCachedFeaturedProducts } from '@/lib/supabase/cache'
import { ProductCard } from './ProductCard'

export async function FeaturedProducts() {
  const data = await getCachedFeaturedProducts()
  
  if (!data || data.length === 0) {
    return null
  }
  
  const products = data.map(item => ({
    ...item,
    store: Array.isArray(item.stores) ? item.stores[0] : item.stores
  }))

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Productos Destacados
          </h2>
          <p className="text-gray-600 text-lg">
            Lo mejor de nuestras tiendas locales
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link 
            href="/catalogo"
            className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  )
}
