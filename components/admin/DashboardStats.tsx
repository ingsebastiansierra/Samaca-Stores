'use client'

import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react'

interface DashboardStatsProps {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  lowStockCount: number
}

export function DashboardStats({
  totalProducts,
  totalOrders,
  totalRevenue,
  lowStockCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      label: 'Ingresos',
      value: `$${totalRevenue.toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      label: 'Stock Bajo',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
