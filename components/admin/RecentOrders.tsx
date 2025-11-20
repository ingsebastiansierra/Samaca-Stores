'use client'

import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Order {
  id: string
  ticket: string
  total: number
  status: string
  created_at: string
  customer_name: string
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Pedidos Recientes</h2>
        <Link
          href="/admin/orders"
          className="text-sm text-black hover:underline flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay pedidos recientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black">#{order.ticket}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{order.customer_name}</span>
                <span className="font-bold text-black">
                  ${order.total.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
