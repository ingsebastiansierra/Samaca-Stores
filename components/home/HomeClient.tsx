'use client'

import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { CategoriesGrid } from './CategoriesGrid'
import { ProductsGrid } from './ProductsGrid'
import { Newsletter } from './Newsletter'
import { HeroSection } from './HeroSection'
import { TrendingProducts } from './TrendingProducts'

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Search & Categories */}
      <section className="relative z-10 mt-0 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg">
            <SearchBar onSearch={handleSearch} />
            <div className="mt-6 sm:mt-8">
              <CategoriesGrid
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsGrid
            searchQuery={searchQuery}
            category={selectedCategory}
            filters={filters}
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white border-t border-gray-200">
        <Newsletter />
      </section>
    </div>
  )
}
