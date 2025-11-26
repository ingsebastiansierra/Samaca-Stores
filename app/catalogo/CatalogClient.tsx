'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters, FilterState } from '@/components/catalog/ProductFilters'
import { JeanTypesGallery } from '@/components/catalog/JeanTypesGallery'
import { EmptyState } from '@/components/catalog/EmptyState'
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category_id?: string
  store_id?: string
  gender?: 'hombre' | 'mujer' | 'unisex'
  product_type?: string
  product_subtype?: string
  sizes?: string[]
  colors?: string[]
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
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    gender: searchParams.get('genero') || undefined,
    productType: searchParams.get('categoria') || undefined,
  })

  // Actualizar filtros cuando cambien los searchParams
  useEffect(() => {
    setFilters({
      gender: searchParams.get('genero') || undefined,
      productType: searchParams.get('categoria') || undefined,
    })
  }, [searchParams])

  // Obtener tallas disponibles según los filtros actuales
  const availableSizes = useMemo(() => {
    const sizesSet = new Set<string>()
    products.forEach(product => {
      if (
        (!filters.gender || product.gender === filters.gender) &&
        (!filters.productType || product.product_type === filters.productType) &&
        (!filters.productSubtype || product.product_subtype === filters.productSubtype) &&
        product.sizes
      ) {
        product.sizes.forEach(size => sizesSet.add(size))
      }
    })
    return Array.from(sizesSet).sort((a, b) => {
      // Ordenar numéricamente si son números, alfabéticamente si no
      const aNum = parseInt(a)
      const bNum = parseInt(b)
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
      return a.localeCompare(b)
    })
  }, [products, filters.gender, filters.productType, filters.productSubtype])

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Búsqueda por texto
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesSearch) return false

      // Filtro por género
      if (filters.gender && product.gender !== filters.gender) return false

      // Filtro por tipo de producto
      if (filters.productType && product.product_type !== filters.productType) return false

      // Filtro por subtipo de producto
      if (filters.productSubtype && filters.productSubtype !== 'ver-todo') {
        if (product.product_subtype !== filters.productSubtype) return false
      }

      // Filtro por talla
      if (filters.size) {
        if (!product.sizes || !product.sizes.includes(filters.size)) return false
      }

      return true
    })
  }, [products, searchTerm, filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleJeanTypeSelect = (slug: string) => {
    setFilters({
      ...filters,
      productSubtype: slug === 'ver-todo' ? undefined : slug
    })
  }

  const handleClearFilters = () => {
    setFilters({
      gender: searchParams.get('genero') || undefined,
      productType: searchParams.get('categoria') || undefined,
    })
    setSearchTerm('')
  }

  const hasActiveFilters = !!(
    filters.productSubtype ||
    filters.size ||
    searchTerm ||
    (filters.gender && !searchParams.get('genero')) ||
    (filters.productType && !searchParams.get('categoria'))
  )

  const showJeanGallery = filters.productType === 'jeans' && (filters.gender === 'hombre' || filters.gender === 'mujer')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28 sm:pt-32 md:pt-36 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
              <span className="text-sky-600 font-mono text-xs sm:text-sm font-semibold">
                {filters.gender ? filters.gender.toUpperCase() : 'CATÁLOGO 2025'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 tracking-tight">
              {filters.productType ? (
                <>
                  {filters.productType.charAt(0).toUpperCase() + filters.productType.slice(1)}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    {filters.gender || ''}
                  </span>
                </>
              ) : (
                <>
                  Explora el{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    Futuro
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="relative bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden group-hover:border-sky-600 transition-colors shadow-sm">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-sky-600 transition-colors" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtros - Ahora arriba en móvil y sidebar en desktop */}
        <div className="mb-6 lg:hidden">
          <ProductFilters
            onFilterChange={handleFilterChange}
            availableSizes={availableSizes}
            gender={filters.gender as 'hombre' | 'mujer'}
            productType={filters.productType}
          />
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar Filters - Solo desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-36">
              <ProductFilters
                onFilterChange={handleFilterChange}
                availableSizes={availableSizes}
                gender={filters.gender as 'hombre' | 'mujer'}
                productType={filters.productType}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Jean Types Gallery */}
            {showJeanGallery && (
              <JeanTypesGallery
                gender={filters.gender as 'hombre' | 'mujer'}
                onSelectType={handleJeanTypeSelect}
                selectedType={filters.productSubtype}
              />
            )}

            {/* Results Count */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> productos encontrados
              </p>
              {filters.size && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Mostrando talla <strong>{filters.size}</strong></span>
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                type={products.length === 0 ? 'no-products' : 'no-results'}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 pb-12 max-w-4xl place-items-center">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
