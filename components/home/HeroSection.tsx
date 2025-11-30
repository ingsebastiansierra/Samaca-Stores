'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchBar } from './SearchBar'
import { CategoriesGrid } from './CategoriesGrid'

interface HeroSectionProps {
  onSearch: (query: string, filters: any) => void
  onCategorySelect: (slug: string) => void
  selectedCategory: string
}

export function HeroSection({ onSearch, onCategorySelect, selectedCategory }: HeroSectionProps) {
  return (
    <section className="relative h-[700px] md:h-[750px] overflow-hidden">
      {/* Background Image con gradiente overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80')`,
          }}
        />
        {/* Gradiente overlay - Púrpura a transparente */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 via-purple-500/70 to-transparent" />
        {/* Oscurecer un poco el lado derecho */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex flex-col justify-center items-center pt-20 md:pt-24 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden md:flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto w-fit"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">EXCLUSIVO ONLINE</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight text-center"
            >
              TODA LA TIENDA HASTA
              <span className="block text-5xl md:text-7xl mt-2">
                50% OFF
              </span>
            </motion.h1>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6"
            >
              <SearchBar onSearch={onSearch} />
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6"
            >
              <div className="bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-3 shadow-xl flex justify-center">
                <CategoriesGrid
                  onCategorySelect={onCategorySelect}
                  selectedCategory={selectedCategory}
                />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-base md:text-lg text-white/90 mb-2"
            >
              DEL 24 DE NOV AL 02 DE DIC <span className="text-white/70">(7:59 A.M.)</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl md:text-2xl font-bold text-white mb-6"
            >
              EXTENDEMOS
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/catalogo?gender=mujer">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  VER MUJER
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>

              <Link href="/catalogo?gender=hombre">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
                >
                  VER HOMBRE
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Black Sale Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute top-20 right-4 md:top-28 md:right-12"
            >
              <div className="bg-black text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-2xl md:text-4xl font-black leading-none">
                  BLACK
                </div>
                <div className="text-2xl md:text-4xl font-black leading-none">
                  SALE
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  )
}
