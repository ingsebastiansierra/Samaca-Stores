'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { updateProduct } from '@/lib/actions/products'
import toast from 'react-hot-toast'
import { ImageUpload } from './ImageUpload'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category_id: string
  is_active: boolean
  images: string[]
}

interface Category {
  id: string
  name: string
}

interface EditProductModalProps {
  product: Product
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditProductModal({ 
  product, 
  categories, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    price: product.price || 0,
    stock: product.stock || 0,
    category_id: product.category_id || (categories[0]?.id || ''),
    is_active: product.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || (categories[0]?.id || ''),
        is_active: product.is_active ?? true,
      })
    }
  }, [isOpen, product, categories])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProduct(product.id, {
        ...formData,
        images: product.images // Enviar las imágenes actualizadas
      })
      toast.success('Producto actualizado')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Error al actualizar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Editar Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Slug/Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link del producto (slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="ejemplo: camiseta-basica"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /producto/{formData.slug}
            </p>
          </div>

          {/* Imagen */}
          <ImageUpload
            currentImage={product.images?.[0]}
            onImageChange={(url) => {
              // Actualizar la primera imagen del array
              const newImages = [...(product.images || [])]
              newImages[0] = url
              product.images = newImages
            }}
          />

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Producto activo (visible en la tienda)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
