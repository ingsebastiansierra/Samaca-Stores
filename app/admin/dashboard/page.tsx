import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/admin/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Obtener store_id
  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  // Obtener métricas del día
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Ventas del día
  const { data: todaySales } = await supabase
    .from('quotations')
    .select('total')
    .eq('store_id', store.id)
    .eq('status', 'converted')
    .gte('created_at', today.toISOString())

  // Cotizaciones pendientes
  const { count: pendingQuotations } = await supabase
    .from('quotations')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .eq('status', 'pending')

  // Productos con stock bajo
  const { count: lowStockProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .lte('stock', 5)
    .gt('stock', 0)

  // Total de productos
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .eq('is_active', true)

  // Ventas de los últimos 7 días
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: weekSales } = await supabase
    .from('quotations')
    .select('total, created_at')
    .eq('store_id', store.id)
    .eq('status', 'converted')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Top productos más cotizados
  const { data: quotations } = await supabase
    .from('quotations')
    .select('items')
    .eq('store_id', store.id)
    .gte('created_at', sevenDaysAgo.toISOString())

  // Procesar productos más cotizados
  const productCounts: Record<string, number> = {}
  quotations?.forEach(q => {
    q.items?.forEach((item: any) => {
      productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity
    })
  })

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  const todayTotal = todaySales?.reduce((sum, sale) => sum + sale.total, 0) || 0

  return (
    <DashboardClient
      storeName={store.name}
      todayTotal={todayTotal}
      pendingQuotations={pendingQuotations || 0}
      lowStockProducts={lowStockProducts || 0}
      totalProducts={totalProducts || 0}
      weekSales={weekSales || []}
      topProducts={topProducts}
    />
  )
}
