'use client'

import { Card } from '@/components/ui/Card'
import { ShoppingBag, Package, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Pedidos Hoy', value: '12', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Productos', value: '156', icon: Package, color: 'text-green-500' },
    { label: 'Ventas del Mes', value: '$2.4M', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Clientes', value: '89', icon: Users, color: 'text-orange-500' }
  ]

  const quickLinks = [
    { href: '/admin/productos', label: 'Gestionar Productos', color: 'bg-blue-500' },
    { href: '/admin/pedidos', label: 'Ver Pedidos', color: 'bg-green-500' },
    { href: '/admin/inventario', label: 'Inventario', color: 'bg-purple-500' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al panel administrativo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Accesos Rápidos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              <Button
                variant="outline"
                className={`w-full h-20 text-lg ${link.color} text-white hover:opacity-90`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pedidos Recientes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-semibold">SAMACA-RP-20251116-{1000 + i}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cliente {i} - Hace {i} hora(s)
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">$120.000</p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Pendiente
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
