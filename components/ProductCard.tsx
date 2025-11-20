'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Store } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  store?: {
    name: string
    slug: string
  }
}

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
    toast.success('Agregado al carrito')
  }

  const productUrl = product.store 
    ? `/tienda/${product.store.slug}/producto/${product.slug}`
    : `/producto/${product.slug}`

  return (
    <div className="group">
      <Link href={productUrl}>
        <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-lg">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 p-3 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </Link>

      <div className="space-y-1">
        {product.store && (
          <Link href={`/tienda/${product.store.slug}`}>
            <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
              <Store className="w-3 h-3" />
              <span>{product.store.name}</span>
            </div>
          </Link>
        )}
        
        <Link href={productUrl}>
          <h3 className="font-semibold text-black group-hover:underline line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-lg font-bold text-black">
          ${product.price.toLocaleString('es-CO')}
        </p>
      </div>
    </div>
  )
}
