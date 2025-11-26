'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Store, Zap, Star } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  store_id?: string
  store?: {
    id?: string
    name: string
    slug: string
  }
}

interface ProductCardProps {
  product: Product
}

// Mapping for better images (simulating transparent/white bg integration)
const PRODUCT_IMAGES: Record<string, string> = {
  'Zapatos Deportivos Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  'Zapatos Casuales Adidas': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
  'Botas de Cuero Premium': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop',
  'Sandalias de Verano': 'https://images.unsplash.com/photo-1621268260866-668f6c237322?q=80&w=800&auto=format&fit=crop',
  'Camiseta Casual Premium': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  'Camisa Formal Elegante': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
  'Jeans Clásicos Levis': 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop',
  'Chaqueta de Cuero': 'https://images.unsplash.com/photo-1551028919-ac7bcb7d7153?q=80&w=800&auto=format&fit=crop',
  'Vestido Casual Floral': 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800&auto=format&fit=crop',
  'Sudadera con Capucha': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
  'Bolso de Cuero Elegante': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  'Gorra Deportiva Nike': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
  'Cinturón de Cuero': 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?q=80&w=800&auto=format&fit=crop',
  'Gafas de Sol Polarizadas': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
  'Reloj Digital Deportivo': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  'Mochila Urbana': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  'Bufanda de Lana': 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=800&auto=format&fit=crop',
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  // Use mapped image or fallback to original
  const displayImage = PRODUCT_IMAGES[product.name] || product.images[0] || '/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: [displayImage],
        store_id: product.store_id || product.store?.id || '',
        store: product.store ? {
          id: product.store.id || product.store_id || '',
          name: product.store.name,
          slug: product.store.slug,
        } : undefined,
      },
      quantity: 1,
    })
    toast.success('Agregado al carrito', {
      icon: '🛍️',
      style: {
        borderRadius: '12px',
        background: '#fff',
        color: '#000',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    })
  }

  const productUrl = `/producto/${product.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full max-w-[270px] mx-auto"
    >
      {/* Card Container - White Neomorphism */}
      <div className="relative h-[380px] w-full bg-white rounded-2xl overflow-visible transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col">

        {/* Main Link covering the card (except button) */}
        <Link href={productUrl} className="absolute inset-0 z-0 rounded-2xl" />

        {/* Store Badge */}
        {product.store && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/5 backdrop-blur-sm rounded-full border border-black/5">
              <Store className="w-2.5 h-2.5 text-gray-600" />
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">
                {product.store.name}
              </span>
            </div>
          </div>
        )}

        {/* New Badge */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 text-white rounded-full shadow-md">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span className="text-[9px] font-bold uppercase tracking-wider">NEW</span>
          </div>
        </div>

        {/* Image Area - Floating Effect */}
        <div className="relative h-[58%] w-full p-4 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white rounded-t-2xl pointer-events-none">
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain drop-shadow-lg mix-blend-multiply"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="relative h-[42%] bg-white p-4 rounded-b-2xl flex flex-col justify-between z-10">
          <div className="pointer-events-none">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-0.5 mb-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
              ))}
              <span className="text-[10px] text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="pointer-events-none">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-0.5">Precio</p>
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-900 font-display">
                  ${product.price.toLocaleString('es-CO')}
                </p>
                <p className="text-[10px] text-gray-500 line-through">
                  ${(product.price * 1.2).toLocaleString('es-CO')}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleAddToCart}
              className="relative z-30 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors duration-300 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
