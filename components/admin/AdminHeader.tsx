'use client'

import { Bell, User, LogOut, FileText, ArrowRight } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-helpers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function AdminHeader() {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [recentQuotations, setRecentQuotations] = useState<any[]>([])
  const [storeName, setStoreName] = useState<string>('')

  useEffect(() => {
    checkNotifications()
    loadStoreName()
  }, [])

  async function loadStoreName() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get store name
    const { data: store } = await supabase
      .from('stores')
      .select('name')
      .eq('user_id', user.id)
      .single()

    if (store) {
      setStoreName(store.name)
    } else {
      // Check if user is staff
      const { data: staff } = await supabase
        .from('store_staff')
        .select('stores(name)')
        .eq('user_id', user.id)
        .single()

      if (staff && staff.stores) {
        setStoreName((staff.stores as any).name)
      }
    }
  }

  async function checkNotifications() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get store id first (simplified check)
    let storeId = null
    const { data: store } = await supabase.from('stores').select('id').eq('user_id', user.id).single()
    if (store) {
      storeId = store.id
    } else {
      const { data: staff } = await supabase.from('store_staff').select('store_id').eq('user_id', user.id).single()
      if (staff) storeId = staff.store_id
    }

    if (storeId) {
      // Count UNVIEWED pending quotations
      const { count } = await supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'pending')
        .is('admin_viewed_at', null)

      setPendingCount(count || 0)

      // Get recent UNVIEWED pending quotations
      const { data: quotations } = await supabase
        .from('quotations')
        .select('*')
        .eq('store_id', storeId)
        .eq('status', 'pending')
        .is('admin_viewed_at', null)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentQuotations(quotations || [])
    }
  }

  async function handleNotificationClick() {
    setShowNotifications(!showNotifications)

    // Si se está abriendo el dropdown, marcar como vistas
    if (!showNotifications && pendingCount > 0) {
      try {
        await fetch('/api/quotations/mark-viewed', { method: 'POST' })
        // Recargar notificaciones después de marcar como vistas
        setTimeout(() => checkNotifications(), 500)
      } catch (error) {
        console.error('Error marking notifications as viewed:', error)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Sesión cerrada')
      // Usar window.location para forzar recarga completa y limpiar estado
      window.location.href = '/'
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Store Name */}
        <div className="flex-1">
          {storeName && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{storeName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <h2 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{storeName}</h2>
                <p className="text-xs text-gray-500">Panel de administración</p>
              </div>
              <div className="sm:hidden">
                <h2 className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{storeName}</h2>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    <p className="text-xs text-gray-500">Cotizaciones pendientes</p>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {recentQuotations.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-sm">No hay notificaciones nuevas</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {recentQuotations.map((quotation) => (
                          <Link
                            key={quotation.id}
                            href={`/admin/cotizaciones/${quotation.id}`}
                            onClick={() => setShowNotifications(false)}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-yellow-100 rounded-lg">
                                <FileText className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  Nueva cotización de {quotation.customer_name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {quotation.ticket} • ${quotation.total.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true, locale: es })}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {recentQuotations.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <Link
                        href="/admin/cotizaciones"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center justify-center gap-1"
                      >
                        Ver todas las cotizaciones
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
