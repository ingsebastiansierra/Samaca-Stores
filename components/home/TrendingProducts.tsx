import Image from 'next/image'
import Link from 'next/link'
import { getCachedTrendingProducts } from '@/lib/supabase/cache'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'

export async function TrendingProducts() {
  const data = await getCachedTrendingProducts()

  if (!data || data.length === 0) return null

  const products = data.map(item => ({
    ...item,
    store: Array.isArray(item.stores) ? item.stores[0] : item.stores
  }))

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
                <TrendingUp className="w-6 h-6 text-neon-blue" />
              </div>
              <span className="text-neon-blue font-mono text-sm tracking-wider">TRENDING NOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Tendencias <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Virales</span>
            </h2>
          </div>

          <Link href="/catalogo" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            Ver todo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/catalogo" className="inline-flex items-center gap-2 text-neon-blue hover:text-white transition-colors font-medium">
            Ver todo el catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
