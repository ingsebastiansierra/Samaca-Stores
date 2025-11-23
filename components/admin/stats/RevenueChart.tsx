'use client'

import { TrendingUp } from 'lucide-react'

interface RevenueChartProps {
    orders: any[]
}

export function RevenueChart({ orders }: RevenueChartProps) {
    // Agrupar ventas por mes (últimos 6 meses)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
            month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            revenue: 0
        }
    }).reverse()

    // Calcular ventas por mes
    orders?.forEach(order => {
        if (order.payment_status === 'paid') {
            const orderDate = new Date(order.created_at)
            const monthKey = orderDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
            const monthData = last6Months.find(m => m.month === monthKey)
            if (monthData) {
                monthData.revenue += Number(order.total)
            }
        }
    })

    const maxRevenue = Math.max(...last6Months.map(m => m.revenue), 1)

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-green-500 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Ventas por Mes</h3>
                    <p className="text-xs text-gray-500">Últimos 6 meses</p>
                </div>
            </div>

            <div className="space-y-3">
                {last6Months.map((month, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 capitalize">{month.month}</span>
                            <span className="font-semibold text-gray-900">
                                ${month.revenue.toLocaleString('es-CO')}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
