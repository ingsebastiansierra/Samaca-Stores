'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Store, MapPin, ArrowRight } from 'lucide-react'

interface StoreData {
  id: string
  name: string
  slug: string
  description: string
  city: string
  logo_url: string
  total_products: number
}

export function FeaturedStores() {
  const [stores, setStores] = useState<StoreData[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchStores()
  }, [])

  async function fetchStores() {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'active')
        .limit(3)

      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (stores.length === 0) return null

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-4"
          >
            Tiendas Destacadas
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Conoce los mejores locales de Samacá
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/tienda/${store.slug}`}>
                <div className="group border-2 border-black rounded-2xl p-8 hover:bg-black hover:text-white transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 group-hover:bg-white rounded-full flex items-center justify-center">
                      <Store className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm opacity-70">
                        <MapPin className="w-4 h-4" />
                        <span>{store.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6 opacity-80">
                    {store.description || 'Descubre nuestra colección de productos'}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {store.total_products} productos
                    </span>
                    <div className="flex items-center gap-2 font-semibold group-hover:gap-4 transition-all">
                      <span>Ver tienda</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Stores */}
        <div className="mt-12 text-center">
          <Link href="/tiendas">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-black text-black font-semibold rounded-full hover:bg-black hover:text-white transition-all"
            >
              Ver Todas las Tiendas
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
