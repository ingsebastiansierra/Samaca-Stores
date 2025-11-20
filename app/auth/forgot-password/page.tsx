'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth/auth-helpers'
import { Button } from '@/components/ui/Button'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      // Validar email
      forgotPasswordSchema.parse({ email })
      
      await resetPassword({ email })
      setSuccess(true)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((error) => {
          const path = error.path.join('.')
          errors[path] = error.message
        })
        setFieldErrors(errors)
        setError('Por favor ingresa un correo válido')
      } else {
        console.error('Error:', err)
        setError(err.message || 'Error al enviar el correo. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              ¡Correo Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold mb-12 block">
            Samacá Store
          </Link>
          
          <div className="space-y-8 mt-16">
            <h2 className="text-4xl font-bold leading-tight">
              ¿Olvidaste tu<br />contraseña?
            </h2>
            <p className="text-xl text-gray-300">
              No te preocupes, te ayudamos a recuperar el acceso a tu cuenta
            </p>
            
            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-gray-300">Ingresa tu correo electrónico</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-gray-300">Revisa tu bandeja de entrada</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-gray-300">Sigue el enlace para crear una nueva contraseña</p>
                </div>
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
              Recuperar Contraseña
            </h1>
            <p className="text-gray-600">
              Te enviaremos un enlace de recuperación
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-black ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800"
              size="lg"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </Button>
          </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-black font-bold hover:underline">
                ← Volver al inicio de sesión
              </Link>
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
