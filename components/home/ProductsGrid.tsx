'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from './ProductCard'
import { Loader2 } from 'lucide-react'

interface ProductsGridProps {
  searchQuery?: string
  category?: string
  filters?: any
}

export function ProductsGrid({ searchQuery = '', category = 'todos', filters = {} }: ProductsGridProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [searchQuery, category, filters])

  const loadProducts = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          stores (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)

      // Filtro de búsqueda
      if (searchQuery && searchQuery.length >= 2) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      // Filtro de categoría (simulado por ahora)
      // TODO: Implementar filtro real cuando tengas categorías

      // Filtros de precio
      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice))
      }
      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice))
      }

      // Ordenamiento
      switch (filters.sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      query = query.limit(20)

      const { data, error } = await query

      if (error) throw error

      const formattedProducts = data?.map(item => ({
        ...item,
        store: Array.isArray(item.stores) ? item.stores[0] : item.stores
      })) || []

      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          {searchQuery 
            ? `No se encontraron productos para "${searchQuery}"`
            : 'No hay productos disponibles'
          }
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
