'use client'

import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react'

interface StatsCardsProps {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export function StatsCards({
  totalProducts,
  totalOrders,
  totalRevenue,
  pendingOrders,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      label: 'Pedidos Pendientes',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-black">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
