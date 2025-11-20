import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { LowStockProducts } from '@/components/admin/LowStockProducts'
import { Store } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Verificar autenticación
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Error de autenticación:', userError)
    redirect('/auth/login')
  }

  // Obtener tienda del usuario
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!store) {
    // El usuario no tiene tienda asignada
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            No tienes una tienda asignada
          </h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta está activa pero aún no tienes una tienda vinculada. 
            Contacta al administrador o crea una nueva tienda.
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/register"
              className="block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Crear Nueva Tienda
            </Link>
            <button
              onClick={() => window.location.href = '/'}
              className="block w-full px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Obtener estadísticas
  const { data: products } = await supabase
    .from('products')
    .select('id, stock, price')
    .eq('store_id', store.id)

  const { data: orders } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const totalProducts = products?.length || 0
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const lowStockCount = products?.filter(p => p.stock <= 5).length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido a {store.name}</p>
      </div>

      {/* Stats */}
      <DashboardStats
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        lowStockCount={lowStockCount}
      />

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentOrders orders={orders || []} />
        <LowStockProducts storeId={store.id} />
      </div>
    </div>
  )
}
