'use client'

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-12 bg-gradient-to-b from-white to-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-medium text-gray-700">Descubre lo mejor de Samacá</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900">
            Encuentra tu estilo perfecto
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de productos de las mejores tiendas locales
          </p>
        </motion.div>
      </div>
    </section>
  )
}
