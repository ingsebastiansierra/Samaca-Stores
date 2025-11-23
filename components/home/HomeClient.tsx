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
    <div className="min-h-screen bg-deep-black">
      {/* Hero Section */}
      <HeroSection />

      {/* Search & Categories */}
      <section className="relative z-10 mt-0 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <SearchBar onSearch={handleSearch} />
            <div className="mt-8">
              <CategoriesGrid
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <ProductsGrid
            searchQuery={searchQuery}
            category={selectedCategory}
            filters={filters}
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black border-t border-white/10">
        <Newsletter />
      </section>
    </div>
  )
}
