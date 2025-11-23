'use client'

import { ShoppingCart, Clock, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface RecentOrdersProps {
    orders: any[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'Preparando', color: 'bg-purple-100 text-purple-800', icon: ShoppingCart },
    ready: { label: 'Listo', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: Clock },
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-500 p-2 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Pedidos Recientes</h3>
                    <p className="text-xs text-gray-500">Últimos 10 pedidos</p>
                </div>
            </div>

            <div className="space-y-3">
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay pedidos aún</p>
                ) : (
                    orders.map((order) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                        const StatusIcon = status.icon

                        return (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                        {order.ticket}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900 text-sm">
                                        ${Number(order.total).toLocaleString('es-CO')}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
