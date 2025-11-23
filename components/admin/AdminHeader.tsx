'use client'

import { Bell, User, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-helpers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AdminHeader() {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
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
        const { count } = await supabase
          .from('quotations')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', storeId)
          .eq('status', 'pending')

        setPendingCount(count || 0)
      }
    }

    checkNotifications()
  }, [])

  const handleSignOut = async () => {
    // ...
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

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
