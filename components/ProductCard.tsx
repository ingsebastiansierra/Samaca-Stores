'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle, Heart } from 'lucide-react'
import { Product } from '@/lib/types/database.types'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { useCartStore } from '@/lib/store/cart-store'
import { createWhatsAppLink, createProductInquiry } from '@/lib/utils/whatsapp'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg'
    })
    toast.success('Producto agregado al carrito')
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(createWhatsAppLink(createProductInquiry(product.name)), '_blank')
  }

  const getStatusBadge = () => {
    if (product.status === 'out_of_stock') {
      return <Badge variant="danger">Agotado</Badge>
    }
    if (product.status === 'low_stock') {
      return <Badge variant="warning">Pocas unidades</Badge>
    }
    return null
  }

  return (
    <Link href={`/producto/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {getStatusBadge()}
            {product.tags?.includes('nuevo') && <Badge variant="info">Nuevo</Badge>}
            {product.tags?.includes('oferta') && <Badge variant="success">🔥 Oferta</Badge>}
          </div>

          <button
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.preventDefault(); toast.success('Agregado a favoritos') }}
          >
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price.toLocaleString('es-CO')}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Agregar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Consultar
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
