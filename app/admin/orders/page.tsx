import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OrdersTable } from '@/components/admin/orders/OrdersTable'
import { Search } from 'lucide-react'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  let query = supabase
    .from('orders')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.or(`ticket.ilike.%${params.search}%,customer_name.ilike.%${params.search}%`)
  }

  const { data: orders } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Pedidos</h1>
        <p className="text-gray-600 mt-1">Gestiona los pedidos de tu tienda</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Buscar por ticket o cliente..."
              defaultValue={params.search}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
          <select
            name="status"
            defaultValue={params.status}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Listo</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
