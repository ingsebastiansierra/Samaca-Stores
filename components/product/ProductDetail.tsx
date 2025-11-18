'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle, Heart, ArrowLeft, Store, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/lib/store/cart-store'
import { createWhatsAppLink, createProductInquiry } from '@/lib/utils/whatsapp'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  sizes?: string[]
  colors?: string[]
  stock: number
  status: string
  brand?: string
  material?: string
  categories: {
    name: string
    slug: string
  }
}

interface Store {
  id: string
  name: string
  slug: string
}

interface ProductDetailProps {
  product: Product
  store: Store
}

export function ProductDetail({ product, store }: ProductDetailProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla')
      return
    }

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity
    })

    toast.success('Producto agregado al carrito')
  }

  const handleWhatsApp = () => {
    window.open(createWhatsAppLink(createProductInquiry(product.name)), '_blank')
  }

  const getStatusBadge = () => {
    if (product.status === 'out_of_stock') {
      return <Badge variant="danger">Agotado</Badge>
    }
    if (product.status === 'low_stock') {
      return <Badge variant="warning">Pocas unidades</Badge>
    }
    return <Badge variant="success">Disponible</Badge>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <span className="text-gray-400">/</span>
          <Link href={`/tienda/${store.slug}`} className="text-gray-600 hover:text-black transition-colors">
            {store.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4"
            >
              <Image
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {getStatusBadge()}
              </div>

              <button
                className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => toast.success('Agregado a favoritos')}
              >
                <Heart className="w-6 h-6 text-black" />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Store Link */}
            <Link href={`/tienda/${store.slug}`}>
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-4">
                <Store className="w-4 h-4" />
                <span>{store.name}</span>
              </div>
            </Link>

            <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-black">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="text-gray-600">
                Stock: {product.stock} unidades
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">
                  Talla: {selectedSize}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">
                  Color: {selectedColor}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-3">Cantidad</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsApp}
                className="border-2 border-black"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 space-y-3">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Marca:</span>
                  <span className="font-semibold">{product.brand}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-semibold">{product.material}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Categoría:</span>
                <span className="font-semibold capitalize">{product.categories.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
