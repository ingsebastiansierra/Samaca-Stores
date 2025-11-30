'use client'

const categories = [
  { name: 'Todos', slug: 'todos' },
  { name: 'Camisetas', slug: 'camisetas' },
  { name: 'Pantalones', slug: 'pantalones' },
  { name: 'Vestidos', slug: 'vestidos' },
  { name: 'Calzado', slug: 'calzado' },
  { name: 'Accesorios', slug: 'accesorios' },
  { name: 'Nuevos', slug: 'nuevos' },
  { name: 'Ofertas', slug: 'ofertas' }
]

interface CategoriesGridProps {
  onCategorySelect: (slug: string) => void
  selectedCategory?: string
}

export function CategoriesGrid({ onCategorySelect, selectedCategory = 'todos' }: CategoriesGridProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="inline-flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategorySelect(category.slug)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category.slug
              ? 'bg-sky-600 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
