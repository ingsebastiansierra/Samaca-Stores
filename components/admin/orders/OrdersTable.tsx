'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Order {
  id: string
  ticket: string
  customer_name: string
  customer_phone: string
  total: number
  status: string
  created_at: string
}

export function OrdersTable({ orders }: { orders: Order[] }) {
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

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay pedidos</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-bold text-black">#{order.ticket}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-black">{order.customer_name}</div>
                    <div className="text-sm text-gray-600">{order.customer_phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-black">
                  ${order.total.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
