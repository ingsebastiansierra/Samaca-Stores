'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, Clock, CreditCard, Package, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SalesDetailTableProps {
    orders: any[]
}

const PAYMENT_METHODS: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    pse: 'PSE',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'Preparando', color: 'bg-purple-100 text-purple-800' },
    ready: { label: 'Listo', color: 'bg-green-100 text-green-800' },
    delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
}

export function SalesDetailTable({ orders }: SalesDetailTableProps) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    // Solo mostrar pedidos pagados
    const paidOrders = orders.filter(o => o.payment_status === 'paid')

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Detalle de Ventas ({paidOrders.length} ventas)
                </h3>
                <p className="text-xs text-gray-500 mt-1">Historial completo de transacciones</p>
            </div>

            <div className="overflow-x-auto">
                {paidOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No hay ventas registradas</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {paidOrders.map((order) => {
                            const isExpanded = expandedOrder === order.id
                            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

                            return (
                                <div key={order.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Fila principal */}
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                                                {/* Fecha y Hora */}
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>Fecha</span>
                                                    </div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {format(new Date(order.created_at), "d 'de' MMM, yyyy", { locale: es })}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(order.created_at), 'HH:mm:ss')}
                                                    </div>
                                                </div>

                                                {/* Cliente */}
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <User className="w-3 h-3" />
                                                        <span>Cliente</span>
                                                    </div>
                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{order.ticket}</p>
                                                </div>

                                                {/* Método de Pago */}
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <CreditCard className="w-3 h-3" />
                                                        <span>Pago</span>
                                                    </div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {PAYMENT_METHODS[order.payment_method] || order.payment_method || 'No especificado'}
                                                    </p>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color} mt-1`}>
                                                        {status.label}
                                                    </span>
                                                </div>

                                                {/* Total */}
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 mb-1">Total</div>
                                                    <p className="text-lg md:text-xl font-bold text-green-600">
                                                        ${Number(order.total).toLocaleString('es-CO')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.items?.length || 0} productos
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botón expandir */}
                                            <button className="text-gray-400 hover:text-gray-600">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detalle expandido */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 bg-gray-50 border-t">
                                            <div className="pt-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Productos Vendidos:</h4>
                                                <div className="space-y-2">
                                                    {order.items?.map((item: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                                    {item.size && <span>Talla: {item.size}</span>}
                                                                    {item.color && <span>Color: {item.color}</span>}
                                                                    <span>Cantidad: {item.quantity}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    ${item.price.toLocaleString('es-CO')} c/u
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Información adicional */}
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    {order.customer_phone && (
                                                        <div>
                                                            <span className="text-gray-500">Teléfono:</span>
                                                            <span className="ml-2 font-medium text-gray-900">{order.customer_phone}</span>
                                                        </div>
                                                    )}
                                                    {order.delivery_city && (
                                                        <div>
                                                            <span className="text-gray-500">Ciudad:</span>
                                                            <span className="ml-2 font-medium text-gray-900">{order.delivery_city}</span>
                                                        </div>
                                                    )}
                                                    {order.paid_at && (
                                                        <div>
                                                            <span className="text-gray-500">Pagado el:</span>
                                                            <span className="ml-2 font-medium text-gray-900">
                                                                {format(new Date(order.paid_at), "d/MM/yyyy HH:mm", { locale: es })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
