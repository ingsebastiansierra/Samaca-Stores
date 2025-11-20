'use client'

import { useState } from 'react'
import { Upload, X, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
}

// Helper para verificar si una URL es de Supabase Storage
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes('supabase.co/storage/v1/object/public/product-images/')
}

// Helper para extraer el path del archivo de una URL de Supabase
function getStoragePathFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/product-images\/(.+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const deleteOldImageIfNeeded = async (oldImageUrl: string) => {
    // Solo eliminar si es una imagen de Supabase Storage
    if (!isSupabaseStorageUrl(oldImageUrl)) {
      return
    }

    const path = getStoragePathFromUrl(oldImageUrl)
    if (!path) return

    try {
      const supabase = createClient()
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path])

      if (error) {
        console.error('Error deleting old image:', error)
      } else {
        console.log('Old image deleted:', path)
      }
    } catch (error) {
      console.error('Error deleting old image:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Debes estar autenticado')
        return
      }

      // Eliminar imagen anterior si existe y es de Storage
      if (currentImage) {
        await deleteOldImageIfNeeded(currentImage)
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      onImageChange(publicUrl)
      toast.success('Imagen subida correctamente')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast.error('Ingresa una URL válida')
      return
    }

    // Validar que sea una URL
    try {
      new URL(urlInput)
      
      // Eliminar imagen anterior si existe y es de Storage
      if (currentImage) {
        await deleteOldImageIfNeeded(currentImage)
      }
      
      onImageChange(urlInput)
      setUrlInput('')
      setShowUrlInput(false)
      toast.success('URL de imagen agregada')
    } catch {
      toast.error('URL inválida')
    }
  }

  const handleRemoveImage = async () => {
    // Eliminar de Storage si es necesario
    if (currentImage) {
      await deleteOldImageIfNeeded(currentImage)
    }
    
    onImageChange('')
    toast.success('Imagen eliminada')
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Imagen del producto
      </label>

      {/* Vista previa de imagen actual */}
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
          <Image
            src={currentImage}
            alt="Imagen del producto"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Opciones de carga */}
      <div className="flex gap-3">
        {/* Subir archivo */}
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors">
            <Upload className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Usar URL */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-black transition-colors"
        >
          <LinkIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Usar URL</span>
        </button>
      </div>

      {/* Input de URL */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Agregar
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Sube una imagen desde tu computadora o pega una URL externa (Unsplash, etc.)
      </p>
    </div>
  )
}
