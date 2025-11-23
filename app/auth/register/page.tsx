'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth/auth-helpers'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle, Store, ShoppingBag, Building2, Plus, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { registerSchema, newStoreSchema } from '@/lib/validations/auth'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'
import { z } from 'zod'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'customer', // 'customer' o 'store_admin'
  })
  const [storeOption, setStoreOption] = useState<'new' | 'existing'>('new')
  const [existingStores, setExistingStores] = useState<any[]>([])
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [loadingStores, setLoadingStores] = useState(false)
  const [storeData, setStoreData] = useState({
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storeCity: 'Samacá',
    storeWhatsapp: '',
    storeCategory: 'ropa',
  })

  // Cargar tiendas existentes cuando se selecciona "store_admin"
  useEffect(() => {
    if (formData.accountType === 'store_admin') {
      loadExistingStores()
    }
  }, [formData.accountType])

  async function loadExistingStores() {
    setLoadingStores(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, city, user_id')
        .is('user_id', null) // Solo tiendas sin dueño asignado
        .order('name')

      if (error) throw error
      setExistingStores(data || [])
    } catch (err) {
      console.error('Error cargando tiendas:', err)
    } finally {
      setLoadingStores(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      // Validar datos del usuario
      registerSchema.parse(formData)

      // Validar datos de la tienda si es necesario
      if (formData.accountType === 'store_admin') {
        if (storeOption === 'existing' && !selectedStoreId) {
          setError('Por favor selecciona una tienda')
          setLoading(false)
          return
        }

        if (storeOption === 'new') {
          newStoreSchema.parse(storeData)
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((error) => {
          const path = error.path.join('.')
          errors[path] = error.message
        })
        setFieldErrors(errors)
        setError('Por favor corrige los errores en el formulario')
      }
      setLoading(false)
      return
    }

    try {
      // Crear usuario
      const { user } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      })

      // Si es administrador de tienda
      if (formData.accountType === 'store_admin' && user) {
        const supabase = createClient()

        if (storeOption === 'new') {
          // Crear nueva tienda
          const slug = storeData.storeName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

          await supabase.from('stores').insert({
            name: storeData.storeName,
            slug: slug,
            description: storeData.storeDescription,
            owner_name: formData.fullName,
            owner_email: formData.email,
            owner_phone: formData.phone,
            address: storeData.storeAddress,
            city: storeData.storeCity,
            whatsapp: storeData.storeWhatsapp,
            user_id: user.id,
            status: 'pending', // Requiere aprobación
          })
        } else {
          // Vincular a tienda existente
          await supabase
            .from('stores')
            .update({
              user_id: user.id,
              owner_name: formData.fullName,
              owner_email: formData.email,
              owner_phone: formData.phone,
              status: 'active', // Activar inmediatamente
            })
            .eq('id', selectedStoreId)
        }
      }

      setSuccess(true)
      toast.success('¡Cuenta creada! Revisa tu correo para confirmar.')

      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      console.error('Error al registrarse:', err)
      setError(err.message || 'Error al crear la cuenta. Intenta de nuevo.')
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
              ¡Cuenta Creada!
            </h2>
            <p className="text-gray-600 mb-4">
              Te hemos enviado un correo de confirmación. Por favor revisa tu bandeja de entrada.
            </p>
            {formData.accountType === 'store_admin' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Tu tienda será revisada</strong> por nuestro equipo antes de ser publicada. Te notificaremos cuando esté lista.
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Serás redirigido al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    )
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
              Administra tu tienda<br />de forma profesional
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Panel de Control Completo</h3>
                  <p className="text-gray-300">Gestiona productos, pedidos e inventario desde un solo lugar</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Ventas en Línea</h3>
                  <p className="text-gray-300">Recibe pedidos 24/7 y aumenta tus ventas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Fácil de Usar</h3>
                  <p className="text-gray-300">Interfaz intuitiva, sin complicaciones técnicas</p>
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
              Crear Cuenta
            </h1>
            <p className="text-gray-600">
              Únete y empieza a vender en línea
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

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-black mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-black mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="3001234567"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-bold text-black mb-3">
                  Tipo de Cuenta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'customer' })}
                    className={`p-4 border-2 rounded-lg transition-all ${formData.accountType === 'customer'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Cliente</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'store_admin' })}
                    className={`p-4 border-2 rounded-lg transition-all ${formData.accountType === 'store_admin'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Building2 className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Dueño de Tienda</div>
                  </button>
                </div>
              </div>

              {/* Store Information - Only if store_admin */}
              {formData.accountType === 'store_admin' && (
                <div className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                  <h3 className="font-bold text-black flex items-center gap-2 text-lg">
                    <Store className="w-5 h-5" />
                    Información de tu Tienda
                  </h3>

                  {/* Store Option Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStoreOption('new')}
                      className={`p-4 border-2 rounded-lg transition-all ${storeOption === 'new'
                          ? 'border-black bg-white shadow-md'
                          : 'border-gray-300 bg-white/50 hover:border-gray-400'
                        }`}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-semibold">Crear Nueva</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreOption('existing')}
                      className={`p-4 border-2 rounded-lg transition-all ${storeOption === 'existing'
                          ? 'border-black bg-white shadow-md'
                          : 'border-gray-300 bg-white/50 hover:border-gray-400'
                        }`}
                    >
                      <LinkIcon className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-semibold">Vincular Existente</div>
                    </button>
                  </div>

                  {/* Existing Store Selection */}
                  {storeOption === 'existing' && (
                    <div>
                      <label htmlFor="existingStore" className="block text-sm font-bold text-black mb-2">
                        Selecciona tu Tienda *
                      </label>
                      {loadingStores ? (
                        <div className="text-center py-4 text-gray-500">
                          Cargando tiendas...
                        </div>
                      ) : existingStores.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                          No hay tiendas disponibles para vincular. Todas las tiendas ya tienen un dueño asignado.
                        </div>
                      ) : (
                        <select
                          id="existingStore"
                          required={storeOption === 'existing'}
                          value={selectedStoreId}
                          onChange={(e) => setSelectedStoreId(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                        >
                          <option value="">-- Selecciona una tienda --</option>
                          {existingStores.map((store) => (
                            <option key={store.id} value={store.id}>
                              {store.name} - {store.city}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="text-xs text-gray-600 mt-2">
                        Esta opción es para dueños cuya tienda ya fue creada por el administrador
                      </p>
                    </div>
                  )}

                  {/* New Store Form */}
                  {storeOption === 'new' && (
                    <>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="storeName" className="block text-sm font-bold text-black mb-2">
                            Nombre de la Tienda *
                          </label>
                          <input
                            id="storeName"
                            type="text"
                            required={formData.accountType === 'store_admin'}
                            value={storeData.storeName}
                            onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                            placeholder="Ej: Boutique Elegancia"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="storeDescription" className="block text-sm font-bold text-black mb-2">
                            Descripción de la Tienda *
                          </label>
                          <textarea
                            id="storeDescription"
                            required={formData.accountType === 'store_admin'}
                            value={storeData.storeDescription}
                            onChange={(e) => setStoreData({ ...storeData, storeDescription: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white resize-none"
                            placeholder="Describe tu tienda y los productos que vendes..."
                            rows={3}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="storeCategory" className="block text-sm font-bold text-black mb-2">
                            Categoría Principal *
                          </label>
                          <select
                            id="storeCategory"
                            required={formData.accountType === 'store_admin'}
                            value={storeData.storeCategory}
                            onChange={(e) => setStoreData({ ...storeData, storeCategory: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                          >
                            <option value="ropa">Ropa y Moda</option>
                            <option value="zapatos">Zapatos y Calzado</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="deportes">Deportes</option>
                            <option value="infantil">Ropa Infantil</option>
                            <option value="hogar">Hogar y Decoración</option>
                            <option value="tecnologia">Tecnología</option>
                            <option value="otros">Otros</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="storeAddress" className="block text-sm font-bold text-black mb-2">
                            Dirección *
                          </label>
                          <input
                            id="storeAddress"
                            type="text"
                            required={formData.accountType === 'store_admin'}
                            value={storeData.storeAddress}
                            onChange={(e) => setStoreData({ ...storeData, storeAddress: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                            placeholder="Calle 5 #12-34"
                          />
                        </div>

                        <div>
                          <label htmlFor="storeCity" className="block text-sm font-bold text-black mb-2">
                            Ciudad *
                          </label>
                          <input
                            id="storeCity"
                            type="text"
                            required={formData.accountType === 'store_admin'}
                            value={storeData.storeCity}
                            onChange={(e) => setStoreData({ ...storeData, storeCity: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                            placeholder="Samacá"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="storeWhatsapp" className="block text-sm font-bold text-black mb-2">
                            WhatsApp de la Tienda *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              id="storeWhatsapp"
                              type="tel"
                              required={formData.accountType === 'store_admin'}
                              value={storeData.storeWhatsapp}
                              onChange={(e) => setStoreData({ ...storeData, storeWhatsapp: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
                              placeholder="573001234567"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Incluye código de país (57 para Colombia)
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Revisión pendiente:</strong> Tu tienda será revisada por nuestro equipo antes de ser publicada. Te notificaremos cuando esté lista (usualmente en 24-48 horas).
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

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
                <div className="mt-2">
                  <PasswordStrengthIndicator password={formData.password} />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-black mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-black ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
                size="lg"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-black font-bold hover:underline">
                  Inicia sesión
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
