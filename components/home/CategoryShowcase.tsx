'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shirt, Footprints, Watch } from 'lucide-react'

const categories = [
  {
    name: 'Ropa',
    slug: 'ropa',
    icon: Shirt,
    description: 'Moda para todos',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800'
  },
  {
    name: 'Zapatos',
    slug: 'zapatos',
    icon: Footprints,
    description: 'Estilo en cada paso',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    icon: Watch,
    description: 'Detalles que marcan',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'
  }
]

export function CategoryShowcase() {
  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explora por Categoría
          </motion.h2>
          <p className="text-gray-400 text-lg">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link key={category.slug} href={`/categoria/${category.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-96 overflow-hidden rounded-2xl bg-gray-900"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full">
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-2">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-300 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition-all">
                      <span>Explorar</span>
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
