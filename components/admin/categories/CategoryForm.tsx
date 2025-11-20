'use client'

import { useState } from 'react'
import { createCategory } from '@/lib/actions/categories'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export function CategoryForm({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('store_id', storeId)
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('is_active', String(formData.is_active))

      await createCategory(data)
      toast.success('Categoría creada')
      setFormData({ name: '', description: '', is_active: true })
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Error al crear')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-black mb-4">Nueva Categoría</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Ej: Camisetas"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
            rows={3}
            placeholder="Describe la categoría..."
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-black">Categoría activa</span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {loading ? 'Creando...' : 'Crear Categoría'}
        </Button>
      </form>
    </div>
  )
}
