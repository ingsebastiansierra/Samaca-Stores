'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, MessageCircle, Heart, ArrowLeft, Loader2, Share2, Zap } from 'lucide-react'
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
  const { addItem } = useCartStore()
  const supabase = createClient()

  useEffect(() => {
    fetchProduct()
  }, [slug])

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
    'Camiseta Básica': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    'Jeans Clásico': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    'Chaqueta Casual': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    'Vestido Elegante': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    'Zapatillas Deportivas': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    'Camiseta Unisex': 'https://images.unsplash.com/photo-1625910513394-ea511bed44ca?q=80&w=735&auto=format&fit=crop'
  }

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error

      // Apply image mapping only if no valid images in DB or if it's a placeholder
      const mappedImage = PRODUCT_IMAGES[data.name]
      const hasValidDbImage = data.images && data.images.length > 0 && !data.images[0].includes('placeholder')

      if (mappedImage && !hasValidDbImage) {
        data.images = [mappedImage, ...data.images.slice(1)]
      }

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
      quantity,
      storeId: product.store_id
    })

    toast.success('Producto agregado al carrito', {
      icon: '🚀',
      style: {
        borderRadius: '10px',
        background: '#111',
        color: '#fff',
        border: '1px solid #00f3ff',
      },
    })
  }

  const handleWhatsApp = () => {
    if (!product) return
    window.open(createWhatsAppLink(createProductInquiry(product.name)), '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Button onClick={() => router.push('/catalogo')} variant="neon">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Catálogo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/catalogo')}
          className="flex items-center text-gray-600 hover:text-sky-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"
                >
                  <Image
                    src={product.images[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-6 md:p-8 drop-shadow-xl mix-blend-multiply"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.status === 'out_of_stock' && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">AGOTADO</span>
                )}
                {product.tags?.includes('nuevo') && (
                  <span className="px-3 py-1 bg-sky-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    NUEVO
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button className="p-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors shadow-lg">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-colors shadow-lg">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${selectedImage === index
                      ? 'border-sky-600 shadow-md scale-105'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-32 h-fit space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-sky-50 rounded-full text-xs font-semibold text-sky-700 border border-sky-200">
                  {product.category?.toUpperCase() || 'GENERAL'}
                </span>
                {product.stock > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <Zap className="w-3 h-3" />
                    <span className="font-semibold">Stock: {product.stock}</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                {product.price > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    ${(product.price * 1.2).toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed text-base">
              <p>{product.description}</p>
            </div>

            {/* Configuration */}
            <div className="space-y-5 p-5 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Talla</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] h-11 px-4 rounded-lg font-semibold transition-all ${selectedSize === size
                          ? 'bg-sky-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${selectedColor === color
                          ? 'bg-gray-900 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Cantidad</label>
                <div className="flex items-center gap-3 bg-gray-100 w-fit p-1 rounded-lg border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-gray-900 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-md hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="w-full !h-16 text-base sm:text-lg font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-md hover:shadow-lg border-none"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsApp}
                className="w-full !h-16 rounded-xl border-2 border-gray-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50 text-gray-700 font-bold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
