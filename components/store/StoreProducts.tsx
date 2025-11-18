'use client'

import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Filter } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  status: string
  category_id: string
}

interface StoreProductsProps {
  products: Product[]
  storeSlug: string
  selectedCategoryId?: string | null
}

export const StoreProducts = forwardRef<HTMLElement, StoreProductsProps>(
  function StoreProducts({ products, storeSlug, selectedCategoryId }, ref) {
    const [filter, setFilter] = useState<'all' | 'available' | 'low_stock'>('all')
    const addItem = useCartStore(state => state.addItem)

    const filteredProducts = products.filter(product => {
      if (selectedCategoryId && product.category_id !== selectedCategoryId) {
        return false
      }
      if (filter === 'all') return true
      return product.status === filter
    })

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
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

    return (
      <section ref={ref} id="productos" className="py-16 px-4 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-black mb-2"
              >
                Todos los Productos
              </motion.h2>
              <p className="text-gray-600">
                {filteredProducts.length} productos {selectedCategoryId ? 'en esta categoría' : 'disponibles'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === 'available' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setFilter('low_stock')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === 'low_stock' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Últimas Unidades
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link href={`/tienda/${storeSlug}/producto/${product.slug}`}>
                  <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-xl">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {product.status === 'low_stock' && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          ¡Últimas unidades!
                        </span>
                      </div>
                    )}
                    
                    {product.status === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-black font-bold rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}
                    
                    {product.status === 'available' && (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="absolute bottom-4 right-4 p-3 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </Link>

                <div className="space-y-1">
                  <Link href={`/tienda/${storeSlug}/producto/${product.slug}`}>
                    <h3 className="font-semibold text-black group-hover:underline line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-black">
                      ${product.price.toLocaleString('es-CO')}
                    </p>
                    
                    {product.stock > 0 && (
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">
                No hay productos
              </h3>
              <p className="text-gray-600">
                Intenta con otro filtro
              </p>
            </div>
          )}
        </div>
      </section>
    )
  }
)
