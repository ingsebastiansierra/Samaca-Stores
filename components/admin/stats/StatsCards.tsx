'use client'

import { Package, ShoppingCart, DollarSign, Clock, TrendingUp, FileText } from 'lucide-react'

interface StatsCardsProps {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  monthlyRevenue: number
  pendingQuotations: number
}

export function StatsCards({
  totalProducts,
  totalOrders,
  totalRevenue,
  pendingOrders,
  monthlyRevenue,
  pendingQuotations,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Ventas Totales',
      value: `$${totalRevenue.toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Todos los tiempos'
    },
    {
      label: 'Ventas del Mes',
      value: `$${monthlyRevenue.toLocaleString('es-CO')}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      description: 'Mes actual'
    },
    {
      label: 'Total Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      description: `${pendingOrders} pendientes`
    },
    {
      label: 'Cotizaciones',
      value: pendingQuotations,
      icon: FileText,
      color: 'bg-yellow-500',
      description: 'Pendientes'
    },
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-indigo-500',
      description: 'En catálogo'
    },
    {
      label: 'Pedidos Pendientes',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Por procesar'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className={`${stat.color} p-2 md:p-3 rounded-lg`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-2xl md:text-3xl font-bold text-black mb-1">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}
