'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteCategory } from '@/lib/actions/categories'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  description: string
  is_active: boolean
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar categoría "${name}"?`)) return

    setDeleting(id)
    try {
      await deleteCategory(id)
      toast.success('Categoría eliminada')
      window.location.reload()
    } catch (error) {
      toast.error('Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-black">Mis Categorías</h2>
      </div>
      
      {categories.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No hay categorías creadas
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-black mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={deleting === category.id}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
