'use client'

import { useState } from 'react'
import { updatePassword } from '@/lib/auth/auth-helpers'
import { Button } from '@/components/ui/Button'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'

export function PasswordChangeForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      await updatePassword(formData.newPassword)
      toast.success('Contraseña actualizada')
      setFormData({ newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-black mb-6">Cambiar Contraseña</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>
          <div className="mt-2">
            <PasswordStrengthIndicator password={formData.newPassword} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-black text-white hover:bg-gray-800"
        >
          {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
        </Button>
      </form>
    </div>
  )
}
