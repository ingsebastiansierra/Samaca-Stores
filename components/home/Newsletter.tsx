'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('¡Gracias por suscribirte!')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Mail className="w-10 h-10" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mantente Actualizado
          </h2>
          
          <p className="text-xl text-gray-400 mb-8">
            Recibe las últimas ofertas y novedades de nuestras tiendas
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="px-6 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Suscribirse</span>
              </motion.button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            No spam. Solo las mejores ofertas.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
