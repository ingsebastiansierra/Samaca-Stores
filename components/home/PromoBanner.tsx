'use client'

import Link from 'next/link'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

export function PromoBanner() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Promo 1: Envío gratis */}
        <Link href="/promociones" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <Zap className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Envío Gratis</h3>
            <p className="text-blue-100 text-sm">
              En compras mayores a $100,000
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium">
              Ver más →
            </div>
          </div>
        </Link>

        {/* Promo 2: Nuevos productos */}
        <Link href="/catalogo?sort=newest" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <Sparkles className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Nuevos Productos</h3>
            <p className="text-purple-100 text-sm">
              Descubre las últimas tendencias
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium">
              Explorar →
            </div>
          </div>
        </Link>

        {/* Promo 3: Ofertas */}
        <Link href="/promociones" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <TrendingUp className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Hasta 30% OFF</h3>
            <p className="text-orange-100 text-sm">
              En productos seleccionados
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium">
              Ver ofertas →
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
