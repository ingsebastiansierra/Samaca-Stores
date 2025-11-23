'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Search, Filter, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category_id?: string
  store_id?: string
  store: {
    id?: string
    name: string
    slug: string
  }
}

interface CatalogClientProps {
  products: Product[]
}

export function CatalogClient({ products }: CatalogClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'ropa', label: 'Ropa' },
    { id: 'zapatos', label: 'Zapatos' },
    { id: 'accesorios', label: 'Accesorios' }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      {/* Header & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span className="text-sky-600 font-mono text-sm font-semibold">CATÁLOGO 2025</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 tracking-tight">
              Explora el <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Futuro</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden group-hover:border-sky-600 transition-colors shadow-sm">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-sky-600 transition-colors" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group ${selectedCategory === category.id
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-sky-600"
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-gray-200 shadow-sm">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
