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
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-neon-blue" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Producto no encontrado</h2>
          <Button onClick={() => router.push('/catalogo')} variant="neon">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Catálogo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/catalogo')}
          className="flex items-center text-gray-400 hover:text-neon-blue transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-2xl"
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
                    className="object-contain p-8 drop-shadow-xl mix-blend-multiply"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {product.status === 'out_of_stock' && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">AGOTADO</span>
                )}
                {product.tags?.includes('nuevo') && (
                  <span className="px-3 py-1 bg-neon-blue text-black text-xs font-bold rounded-full shadow-lg">NUEVO</span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                <button className="p-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-neon-purple hover:text-white hover:border-neon-purple transition-colors shadow-lg">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-colors shadow-lg">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === index
                      ? 'border-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                      : 'border-transparent opacity-50 hover:opacity-100'
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
          <div className="lg:sticky lg:top-24 h-fit space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-neon-blue border border-neon-blue/20">
                  {product.category?.toUpperCase() || 'GENERAL'}
                </span>
                <div className="flex items-center gap-1 text-xs text-neon-lime">
                  <Zap className="w-3 h-3" />
                  <span>En stock: {product.stock}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                {product.price > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    ${(product.price * 1.2).toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Configuration */}
            <div className="space-y-6 p-6 bg-white/5 rounded-3xl border border-white/10">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">TALLA</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] h-12 px-4 rounded-xl font-medium transition-all ${selectedSize === size
                          ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                          : 'bg-black/50 text-gray-400 hover:bg-white/10 border border-white/10'
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
                  <label className="block text-sm font-medium text-gray-400 mb-3">COLOR</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedColor === color
                          ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]'
                          : 'bg-black/50 text-gray-400 hover:bg-white/10 border border-white/10'
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
                <label className="block text-sm font-medium text-gray-400 mb-3">CANTIDAD</label>
                <div className="flex items-center gap-4 bg-black/50 w-fit p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center justify-center text-xl"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-white font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="flex-1 h-14 text-lg bg-neon-blue text-black hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] border-none"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                AGREGAR AL CARRITO
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsApp}
                className="h-14 w-14 p-0 rounded-xl border-white/20 hover:border-neon-lime hover:text-neon-lime hover:bg-neon-lime/10"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
