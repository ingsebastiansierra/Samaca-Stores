'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Plus, X, Upload } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name: string
  description: string
  price: number
  stock: number
  category_id: string
  images: string[]
  sizes: string[]
  colors: string[]
  brand: string
  is_active: boolean
  is_featured: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    category_id: product?.category_id || '',
    brand: product?.brand || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  })
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [imageInput, setImageInput] = useState('')
  const [sizes, setSizes] = useState<string[]>(product?.sizes || [])
  const [sizeInput, setSizeInput] = useState('')
  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [colorInput, setColorInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value))
      })
      data.append('images', JSON.stringify(images))
      data.append('sizes', JSON.stringify(sizes))
      data.append('colors', JSON.stringify(colors))

      if (product?.id) {
        await updateProduct(product.id, data)
        toast.success('Producto actualizado')
      } else {
        await createProduct(data)
        toast.success('Producto creado')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (imageInput && !images.includes(imageInput)) {
      setImages([...images, imageInput])
      setImageInput('')
    }
  }

  const addSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput])
      setSizeInput('')
    }
  }

  const addColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors([...colors, colorInput])
      setColorInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Información Básica</h2>

        <div className="space-y-3 sm:space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Ej: Camiseta Básica"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
              rows={4}
              placeholder="Describe el producto..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Categoría *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Precio *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-base"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-base"
                placeholder="0"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Marca (Opcional)
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Ej: Nike"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-black mb-4">Imágenes</h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="URL de la imagen"
            />
            <Button type="button" onClick={addImage}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sizes & Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Sizes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Tallas</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Ej: M"
              />
              <Button type="button" onClick={addSize}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black text-white rounded-full text-sm flex items-center gap-2"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Colores</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Ej: Rojo"
              />
              <Button type="button" onClick={addColor}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black text-white rounded-full text-sm flex items-center gap-2"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => setColors(colors.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Configuración</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-black">Producto activo</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-black">Producto destacado</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pb-24 lg:pb-8">
        <Link
          href="/admin/products"
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-black transition-colors font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancelar
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white hover:bg-gray-800 !h-12 font-semibold text-sm sm:text-base"
        >
          {loading ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  )
}
