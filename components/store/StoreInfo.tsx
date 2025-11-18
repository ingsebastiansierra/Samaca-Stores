'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, Phone, Mail } from 'lucide-react'

interface Store {
  description: string
  phone: string
  email: string
  address: string
  business_hours: any
}

interface StoreInfoProps {
  store: Store
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <section className="py-12 px-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-black mb-4">
              Sobre Nosotros
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {store.description || 'Bienvenido a nuestra tienda. Ofrecemos productos de la más alta calidad para ti.'}
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-black mb-4">
              Contacto
            </h3>
            
            {store.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <a href={`tel:${store.phone}`} className="text-black font-medium hover:underline">
                    {store.phone}
                  </a>
                </div>
              </div>
            )}
            
            {store.email && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${store.email}`} className="text-black font-medium hover:underline">
                    {store.email}
                  </a>
                </div>
              </div>
            )}
            
            {store.address && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="text-black font-medium">
                    {store.address}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
