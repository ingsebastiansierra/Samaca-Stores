import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/admin/stats/StatsCards'
import { TopProducts } from '@/components/admin/stats/TopProducts'
import { RevenueChart } from '@/components/admin/stats/RevenueChart'
import { RecentOrders } from '@/components/admin/stats/RecentOrders'
import { SalesDetailTable } from '@/components/admin/stats/SalesDetailTable'

export default async function StatsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  // Obtener estadísticas
  const { data: products } = await supabase
    .from('products')
    .select('id, stock, price')
    .eq('store_id', store.id)

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  const { data: quotations } = await supabase
    .from('quotations')
    .select('id, total, status')
    .eq('store_id', store.id)

  const totalProducts = products?.length || 0
  const totalOrders = orders?.length || 0

  // Ingresos totales (solo pedidos pagados)
  const totalRevenue = orders
    ?.filter(o => o.payment_status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0) || 0

  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const pendingQuotations = quotations?.filter(q => q.status === 'pending').length || 0

  // Ingresos del mes actual
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthlyRevenue = orders
    ?.filter(o =>
      o.payment_status === 'paid' &&
      new Date(o.created_at) >= firstDayOfMonth
    )
    .reduce((sum, order) => sum + Number(order.total), 0) || 0

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Ventas y Estadísticas</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Análisis de ventas de {store.name}</p>
      </div>

      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        pendingOrders={pendingOrders}
        monthlyRevenue={monthlyRevenue}
        pendingQuotations={pendingQuotations}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <RevenueChart orders={orders || []} />
        <TopProducts storeId={store.id} />
      </div>

      <RecentOrders orders={orders?.slice(0, 10) || []} />

      <SalesDetailTable orders={orders || []} />
    </div>
  )
}
