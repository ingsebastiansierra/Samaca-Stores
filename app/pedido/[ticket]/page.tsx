'use client'

import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'
import Link from 'next/link'
import { parseTicket } from '@/lib/utils/ticket-generator'

export default function PedidoPage() {
  const params = useParams()
  const ticket = params.ticket as string

  // Mock data - Replace with Supabase query
  const order = {
    ticket,
    status: 'pending' as const,
    customer_name: 'Juan Pérez',
    items: [
      { product_name: 'Zapatos Deportivos', quantity: 1, price: 120000 }
    ],
    total: 120000,
    created_at: new Date().toISOString()
  }

  const ticketInfo = parseTicket(ticket)

  const statusConfig = {
    pending: { icon: Clock, label: 'Pendiente', variant: 'warning' as const, color: 'text-yellow-500' },
    reserved: { icon: Package, label: 'Reservado', variant: 'info' as const, color: 'text-blue-500' },
    shipped: { icon: Truck, label: 'Enviado', variant: 'info' as const, color: 'text-blue-500' },
    delivered: { icon: CheckCircle, label: 'Entregado', variant: 'success' as const, color: 'text-green-500' },
    cancelled: { icon: XCircle, label: 'Cancelado', variant: 'danger' as const, color: 'text-red-500' }
  }

  const currentStatus = statusConfig[order.status]
  const StatusIcon = currentStatus.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Estado del Pedido</h1>
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Ticket:</span>
          <span className="font-mono font-bold text-lg">{ticket}</span>
        </div>
      </div>

      <Card className="p-8 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${currentStatus.color}`}>
            <StatusIcon className="w-12 h-12" />
          </div>
        </div>

        <div className="text-center mb-8">
          <Badge variant={currentStatus.variant} className="text-lg px-4 py-2">
            {currentStatus.label}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Cliente</span>
            <span className="font-semibold">{order.customer_name}</span>
          </div>

          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Fecha</span>
            <span className="font-semibold">
              {new Date(order.created_at).toLocaleDateString('es-CO')}
            </span>
          </div>

          <div className="py-3">
            <h3 className="font-semibold mb-3">Productos</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.product_name} x{item.quantity}</span>
                <span className="font-semibold">
                  ${item.price.toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-600">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary-600">
              ${order.total.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Link href="/catalogo">
          <Button variant="outline">Seguir Comprando</Button>
        </Link>
        <Link href="/">
          <Button>Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  )
}
