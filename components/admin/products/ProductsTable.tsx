'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { deleteProduct } from '@/lib/actions/products'
import toast from 'react-hot-toast'
import { EditProductModal } from './EditProductModal'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  images: string[]
  is_active: boolean
  category_id: string
  categories: {
    id: string
    name: string
  }
}

interface ProductsTableProps {
  products: Product[]
  storeId: string
  categories: Array<{ id: string; name: string }>
}

export function ProductsTable({ products, storeId, categories }: ProductsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return

    setDeleting(id)
    try {
      await deleteProduct(id)
      toast.success('Producto eliminado')
      window.location.reload()
    } catch (error) {
      toast.error('Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-bold text-black mb-2">No hay productos</h3>
        <p className="text-gray-600 mb-6">
          Comienza agregando tu primer producto a la tienda
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Crear Primer Producto
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-black">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.categories?.name || 'Sin categoría'}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-black">
                  ${product.price.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-800'
                      : product.stock <= 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar producto"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleting === product.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  )
}
