'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Package, ArrowRight } from 'lucide-react'

interface Store {
  id: string
  name: string
  slug: string
  description: string
  city: string
  logo_url: string
  banner_url: string
  total_products: number
}

interface StoresGridProps {
  stores: Store[]
}

export function StoresGrid({ stores }: StoresGridProps) {
  if (stores.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-3xl font-bold text-black mb-2">
            No hay tiendas disponibles
          </h2>
          <p className="text-gray-600">
            Pronto habrá nuevas tiendas registradas
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/tienda/${store.slug}`}>
                <div className="group bg-white border-2 border-black rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Banner */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={store.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                      alt={store.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Logo & Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-black flex-shrink-0 bg-white">
                        <Image
                          src={store.logo_url || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200'}
                          alt={`${store.name} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black mb-1 group-hover:underline">
                          {store.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{store.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {store.description || 'Descubre nuestra colección de productos de calidad'}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{store.total_products} productos</span>
                      </div>
                      
                      <div className="flex items-center gap-2 font-bold text-black group-hover:gap-4 transition-all">
                        <span>Ver tienda</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
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
