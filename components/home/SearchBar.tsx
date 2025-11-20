'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, X, TrendingUp, Clock, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface SearchBarProps {
  onSearch: (query: string, filters: any) => void
}

const popularSearches = [
  { text: 'camisetas', icon: '👕' },
  { text: 'jeans', icon: '👖' },
  { text: 'vestidos', icon: '👗' },
  { text: 'zapatillas', icon: '👟' },
  { text: 'chaquetas', icon: '🧥' },
  { text: 'accesorios', icon: '👜' }
]

export function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  })

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }, [])

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      saveRecentSearch(search)
      onSearch(search, filters)
      setShowSuggestions(false)
    }
  }

  const handleInputChange = async (value: string) => {
    setSearch(value)
    setShowSuggestions(true)
    
    // Búsqueda en tiempo real
    if (value.length >= 2) {
      onSearch(value, filters)
      await loadSuggestions(value)
    } else if (value.length === 0) {
      onSearch('', filters)
      setSuggestions([])
    }
  }

  const loadSuggestions = async (query: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, price, images')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(5)
    
    setSuggestions(data || [])
  }

  const saveRecentSearch = (query: string) => {
    const recent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(recent)
    localStorage.setItem('recentSearches', JSON.stringify(recent))
  }

  const handleSuggestionClick = (query: string) => {
    setSearch(query)
    saveRecentSearch(query)
    onSearch(query, filters)
    setShowSuggestions(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4" ref={searchRef}>
      {/* Buscador compacto */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 border rounded-lg transition-all flex items-center gap-1.5 ${
              showFilters 
                ? 'bg-white text-black border-white' 
                : 'bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Panel de sugerencias estilo Temu */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            {/* Búsquedas recientes */}
            {recentSearches.length > 0 && search.length === 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  Búsquedas recientes
                </div>
                <div className="space-y-1">
                  {recentSearches.map((recent, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(recent)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                    >
                      {recent}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular ahora */}
            {search.length === 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Popular ahora
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {popularSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(item.text)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors text-left"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sugerencias de productos */}
            {suggestions.length > 0 && search.length >= 2 && (
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Productos sugeridos
                </div>
                <div className="space-y-2">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.name)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.price.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Panel de filtros compacto */}
      {showFilters && (
        <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Filtros</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => {
                const newFilters = { ...filters, minPrice: e.target.value }
                setFilters(newFilters)
                onSearch(search, newFilters)
              }}
              placeholder="Precio mín"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => {
                const newFilters = { ...filters, maxPrice: e.target.value }
                setFilters(newFilters)
                onSearch(search, newFilters)
              }}
              placeholder="Precio máx"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black"
            />
            <select
              value={filters.sortBy}
              onChange={(e) => {
                const newFilters = { ...filters, sortBy: e.target.value }
                setFilters(newFilters)
                onSearch(search, newFilters)
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="newest">Nuevos</option>
              <option value="price-asc">$ Menor</option>
              <option value="price-desc">$ Mayor</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
