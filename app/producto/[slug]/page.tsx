'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle, Heart, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Product } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/store/cart-store'
import { createWhatsAppLink, createProductInquiry } from '@/lib/utils/whatsapp'
import toast from 'react-hot-toast'

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore(state => state.addItem)
  const supabase = createClient()

  useEffect(() => {
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .single()

      if (error) throw error
      
      setProduct(data)
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0])
      }
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Producto no encontrado')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

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
    if (!product) return
    window.open(createWhatsAppLink(createProductInquiry(product.name)), '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Producto no encontrado</h2>
          <Button onClick={() => router.push('/catalogo')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Catálogo
          </Button>
        </div>
      </div>
    )
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/catalogo')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4"
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
              {product.tags?.includes('nuevo') && <Badge variant="info">Nuevo</Badge>}
              {product.tags?.includes('oferta') && <Badge variant="success">🔥 Oferta</Badge>}
            </div>

            <button
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              onClick={() => toast.success('Agregado a favoritos')}
            >
              <Heart className="w-6 h-6 text-gray-700" />
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
                      ? 'border-primary-600 scale-95'
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
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-primary-600">
              ${product.price.toLocaleString('es-CO')}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Stock: {product.stock} unidades
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Talla: {selectedSize}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 text-primary-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
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
              <label className="block text-sm font-semibold mb-3">
                Color: {selectedColor}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 text-primary-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
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
            <label className="block text-sm font-semibold mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-600 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Agregar al Carrito
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Category */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Categoría:</span>{' '}
              <span className="capitalize">{product.category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
