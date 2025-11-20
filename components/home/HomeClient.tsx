'use client'

import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { CategoriesGrid } from './CategoriesGrid'
import { ProductsGrid } from './ProductsGrid'
import { Newsletter } from './Newsletter'

export function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [filters, setFilters] = useState<any>({})

  const handleSearch = (query: string, newFilters: any) => {
    setSearchQuery(query)
    setFilters(newFilters)
  }

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero con imagen de fondo */}
      <section className="relative bg-gray-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80)',
            opacity: 0.4
          }}
        />
        
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-white">
            Moda Start
          </h1>
          <p className="text-center text-gray-200 mb-6 text-lg">
            Encuentra tu estilo perfecto
          </p>
          
          {/* Buscador */}
          <SearchBar onSearch={handleSearch} />
          
          {/* Categorías pegadas debajo */}
          <div className="mt-4">
            <CategoriesGrid 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ProductsGrid 
            searchQuery={searchQuery}
            category={selectedCategory}
            filters={filters}
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gray-50">
        <Newsletter />
      </section>
    </div>
  )
}
