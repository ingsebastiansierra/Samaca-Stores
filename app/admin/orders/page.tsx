import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OrdersTable } from '@/components/admin/orders/OrdersTable'
import { OrdersFilters } from '@/components/admin/orders/OrdersFilters'

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
    // Buscar en múltiples campos: ticket, nombre, teléfono, total
    const searchTerm = params.search.toLowerCase()

    // Si el término de búsqueda es un número, también buscar en total
    const isNumeric = !isNaN(Number(searchTerm.replace(/[,$]/g, '')))

    if (isNumeric) {
      // Buscar en ticket, nombre, teléfono y total
      query = query.or(
        `ticket.ilike.%${params.search}%,` +
        `customer_name.ilike.%${params.search}%,` +
        `customer_phone.ilike.%${params.search}%,` +
        `total.eq.${searchTerm.replace(/[,$]/g, '')}`
      )
    } else {
      // Buscar solo en campos de texto
      query = query.or(
        `ticket.ilike.%${params.search}%,` +
        `customer_name.ilike.%${params.search}%,` +
        `customer_phone.ilike.%${params.search}%`
      )
    }
  }

  const { data: orders } = await query

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Pedidos</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Gestiona los pedidos de tu tienda</p>
      </div>

      <OrdersFilters />

      <OrdersTable orders={orders || []} />
    </div>
  )
}
