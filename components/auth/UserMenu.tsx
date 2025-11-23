'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Store, ShoppingBag, Settings, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser, signOut } from '@/lib/auth/auth-helpers'
import toast from 'react-hot-toast'
import Link from 'next/link'

export function UserMenu({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error: any) {
      // Si no hay sesión, es normal - el usuario no está autenticado
      if (error?.message?.includes('session')) {
        setUser(null)
      } else {
        console.error('Error loading user:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Sesión cerrada')
      // Usar window.location para forzar recarga completa
      window.location.href = '/'
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  if (loading) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
    )
  }

  if (!user) {
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors text-center"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors text-center"
        >
          Registrarse
        </Link>
      </div>
    )
  }

  // Mobile version - show links directly
  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <p className="font-bold text-black text-sm">
            {user.user_metadata?.full_name || 'Usuario'}
          </p>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>

        <Link
          href="/perfil"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <User className="w-5 h-5" />
          <span>Mi Perfil</span>
        </Link>

        <Link
          href="/mis-pedidos"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Mis Pedidos</span>
        </Link>

        <Link
          href="/perfil/cotizaciones"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <FileText className="w-5 h-5" />
          <span>Mis Cotizaciones</span>
        </Link>

        {user.user_metadata?.role !== 'customer' && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          >
            <Store className="w-5 h-5" />
            <span>Panel Admin</span>
          </Link>
        )}

        <Link
          href="/configuracion"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
        >
          <Settings className="w-5 h-5" />
          <span>Configuración</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    )
  }

  // Desktop version - dropdown menu
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
          {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-black z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-200">
                <p className="font-bold text-black">
                  {user.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="py-2">
                <Link
                  href="/perfil"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                >
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  href="/mis-pedidos"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Mis Pedidos</span>
                </Link>

                <Link
                  href="/perfil/cotizaciones"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                >
                  <FileText className="w-5 h-5" />
                  <span>Mis Cotizaciones</span>
                </Link>

                {user.user_metadata?.role !== 'customer' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                  >
                    <Store className="w-5 h-5" />
                    <span>Panel Admin</span>
                  </Link>
                )}

                <Link
                  href="/configuracion"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
