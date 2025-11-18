'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

interface StoreCategoriesProps {
  categories: Category[]
  onCategoryClick: (categoryId: string) => void
}

export function StoreCategories({ categories, onCategoryClick }: StoreCategoriesProps) {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-black mb-8"
        >
          Categorías
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onCategoryClick(category.id)}
                className="w-full text-left group p-6 bg-white border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-2">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-sm opacity-70 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 font-semibold text-sm group-hover:gap-4 transition-all">
                  <span>Ver productos</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
