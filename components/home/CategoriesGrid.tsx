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
    <div className="flex justify-center">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategorySelect(category.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.slug
                ? 'bg-white text-black'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
