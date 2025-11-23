'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth/auth-helpers'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      // Validar datos
      loginSchema.parse(formData)

      const result = await signIn(formData)

      // Verificar que la sesión se haya creado correctamente
      if (!result.session) {
        throw new Error('No se pudo crear la sesión')
      }

      toast.success('¡Bienvenido!')

      // Esperar un momento para que las cookies se guarden
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirigir con window.location para forzar recarga completa
      window.location.href = '/admin/dashboard'
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((error) => {
          const path = error.path.join('.')
          errors[path] = error.message
        })
        setFieldErrors(errors)
        setError('Por favor corrige los errores en el formulario')
      } else {
        console.error('Error al iniciar sesión:', err)
        setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex pt-24">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold mb-12 block">
            Samacá Store
          </Link>

          <div className="space-y-8 mt-16">
            <h2 className="text-4xl font-bold leading-tight">
              Bienvenido de vuelta
            </h2>
            <p className="text-xl text-gray-300">
              Accede a tu panel de administración y gestiona tu tienda
            </p>

            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-gray-300">Gestiona tus productos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-gray-300">Revisa tus pedidos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-gray-300">Actualiza tu inventario</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-gray-300">Ve tus estadísticas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          © 2024 Samacá Store. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-black">
              Samacá Store
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600">
              Accede a tu panel de administración
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-black ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-black ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-black hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
                size="lg"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/auth/register" className="text-black font-bold hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home - Mobile */}
          <div className="mt-6 text-center lg:hidden">
            <Link href="/" className="text-gray-600 hover:text-black text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
