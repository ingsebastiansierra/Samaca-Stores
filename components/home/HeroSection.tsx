'use client'

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-200/30 via-white to-white opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-sky-200 rounded-full mb-8 mt-28 shadow-lg">
            <Zap className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-medium text-gray-700 tracking-wide">THE FUTURE OF FASHION IS HERE</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter relative">
            <span className="relative inline-block">
              <span className="absolute -inset-1 blur-2xl bg-sky-400/30" />
              <span className="relative text-gray-900">SAMACÁ</span>
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
              STORE
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-24 max-w-2xl mx-auto leading-relaxed">
            Explora una colección curada de las mejores tiendas locales.
            <span className="text-gray-900 font-semibold"> Moda</span>,
            <span className="text-gray-900 font-semibold"> Estilo</span> y
            <span className="text-gray-900 font-semibold"> Tecnología</span>.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 tracking-widest">SCROLL</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-sky-600 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
