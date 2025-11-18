'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Phone, Mail, Globe, Facebook, Instagram } from 'lucide-react'

interface Store {
  id: string
  name: string
  description: string
  banner_url: string
  logo_url: string
  city: string
  address: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  whatsapp: string
}

interface StoreBannerProps {
  store: Store
}

export function StoreBanner({ store }: StoreBannerProps) {
  const bannerImage = store.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600'
  const logoImage = store.logo_url || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-[60vh] overflow-hidden bg-black">
        <Image
          src={bannerImage}
          alt={store.name}
          fill
          className="object-cover opacity-60"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Store Logo & Name */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-end gap-6"
            >
              {/* Logo */}
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0">
                <Image
                  src={logoImage}
                  alt={`${store.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Store Info */}
              <div className="flex-1 text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-3">
                  {store.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  {store.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{store.city}</span>
                    </div>
                  )}
                  
                  {store.address && (
                    <span className="text-gray-300">•</span>
                  )}
                  
                  {store.address && (
                    <span className="text-gray-300">{store.address}</span>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {store.whatsapp && (
                  <a
                    href={`https://wa.me/${store.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    <Phone className="w-6 h-6" />
                  </a>
                )}
                
                {store.facebook && (
                  <a
                    href={store.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                
                {store.instagram && (
                  <a
                    href={store.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    <Globe className="w-6 h-6" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
