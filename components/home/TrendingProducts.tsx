'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  store_id: string
  store: {
    name: string
    slug: string
  }
}

export function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  async function fetchTrendingProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          images,
          store_id,
          stores!inner (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4)

      if (error) throw error
      
      const transformedData = data?.map(item => ({
        ...item,
        store: Array.isArray(item.stores) ? item.stores[0] : item.stores
      })) || []
      
      setProducts(transformedData)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-black rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-black">
              Tendencias
            </h2>
            <p className="text-gray-600">
              Lo más popular del momento
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/tienda/${product.store.slug}/producto/${product.slug}`}>
                <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                        TRENDING
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-xs text-gray-500 mb-2">
                      {product.store.name}
                    </p>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-black">
                      ${product.price.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
