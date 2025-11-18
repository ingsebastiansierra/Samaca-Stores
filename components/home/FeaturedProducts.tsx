'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, Store } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  store_id: string
  store: {
    name: string
    slug: string
  }
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(state => state.addItem)
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          images,
          store_id,
          stores!inner (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .limit(8)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        store: Array.isArray(item.stores) ? item.stores[0] : item.stores
      })) || []
      
      setProducts(transformedData)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg'
    })
    toast.success('Agregado al carrito')
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-4"
          >
            Productos Destacados
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Lo mejor de nuestras tiendas locales
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/tienda/${product.store.slug}/producto/${product.slug}`}>
                <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-lg">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(product)
                    }}
                    className="absolute bottom-4 right-4 p-3 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </Link>

              <div className="space-y-1">
                <Link href={`/tienda/${product.store.slug}`}>
                  <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
                    <Store className="w-3 h-3" />
                    <span>{product.store.name}</span>
                  </div>
                </Link>
                
                <Link href={`/tienda/${product.store.slug}/producto/${product.slug}`}>
                  <h3 className="font-semibold text-black group-hover:underline line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-lg font-bold text-black">
                  ${product.price.toLocaleString('es-CO')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/catalogo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Ver Todos los Productos
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
