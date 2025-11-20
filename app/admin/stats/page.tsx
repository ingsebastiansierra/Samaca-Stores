import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/admin/stats/StatsCards'
import { TopProducts } from '@/components/admin/stats/TopProducts'

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
    .select('id, total, status, created_at')
    .eq('store_id', store.id)

  const totalProducts = products?.length || 0
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Estadísticas</h1>
        <p className="text-gray-600 mt-1">Análisis de tu tienda {store.name}</p>
      </div>

      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        pendingOrders={pendingOrders}
      />

      <TopProducts storeId={store.id} />
    </div>
  )
}
