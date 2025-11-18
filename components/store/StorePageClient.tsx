'use client'

import { useState, useRef } from 'react'
import { StoreBanner } from './StoreBanner'
import { StoreInfo } from './StoreInfo'
import { StoreCategories } from './StoreCategories'
import { StoreProducts } from './StoreProducts'

interface StorePageClientProps {
  store: any
  categories: any[]
  products: any[]
  storeSlug: string
}

export function StorePageClient({ store, categories, products, storeSlug }: StorePageClientProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const productsRef = useRef<HTMLElement>(null)

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    
    // Scroll suave a la sección de productos
    productsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <StoreBanner store={store} />
      
      {/* Store Info */}
      <StoreInfo store={store} />
      
      {/* Categories */}
      {categories.length > 0 && (
        <StoreCategories 
          categories={categories} 
          onCategoryClick={handleCategoryClick}
        />
      )}
      
      {/* Products */}
      {products.length > 0 && (
        <StoreProducts 
          ref={productsRef}
          products={products} 
          storeSlug={storeSlug}
          selectedCategoryId={selectedCategoryId}
        />
      )}
    </div>
  )
}
