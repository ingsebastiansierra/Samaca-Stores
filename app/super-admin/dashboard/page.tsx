import { getGlobalStats } from '@/lib/actions/super-admin'
import { DollarSign, Store, ShoppingCart, Package, Users, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
    const stats = await getGlobalStats()

    const statCards = [
        {
            title: 'Ingresos Totales',
            value: `$${stats.totalRevenue.toLocaleString('es-CO')}`,
            icon: DollarSign,
            color: 'bg-green-500',
            href: '/super-admin/analytics'
        },
        {
            title: 'Tiendas Activas',
            value: `${stats.activeStores} / ${stats.totalStores}`,
            icon: Store,
            color: 'bg-blue-500',
            href: '/super-admin/stores'
        },
        {
            title: 'Pedidos Totales',
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-purple-500',
            href: '/super-admin/analytics'
        },
        {
            title: 'Productos',
            value: stats.totalProducts.toLocaleString(),
            icon: Package,
            color: 'bg-orange-500',
            href: '/super-admin/stores'
        },
        {
            title: 'Usuarios',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'bg-pink-500',
            href: '/super-admin/users'
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
                    <p className="text-gray-600 mt-1">Monitoreo completo de la plataforma</p>
                </div>
                <Link
                    href="/super-admin/stores/new"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    + Nueva Tienda
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Top Stores */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Top 5 Tiendas por Ventas</h2>
                    <Link href="/super-admin/stores" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Ver todas →
                    </Link>
                </div>
                <div className="space-y-4">
                    {stats.topStores.map((store, index) => (
                        <Link
                            key={store.id}
                            href={`/super-admin/stores/${store.id}`}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{store.name}</p>
                                    <p className="text-sm text-gray-600">{store.city}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">${(store.total_sales || 0).toLocaleString('es-CO')}</p>
                                <p className="text-sm text-gray-600">{store.total_orders || 0} pedidos</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Users by Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Super Admins</h3>
                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                            {stats.usersByRole.super_admin}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Acceso total a la plataforma</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Admins de Tienda</h3>
                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                            {stats.usersByRole.store_admin}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Gestionan sus tiendas</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Usuarios</h3>
                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                            {stats.usersByRole.user}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Clientes de la plataforma</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg shadow-md p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        href="/super-admin/stores/new"
                        className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                    >
                        <Store className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Crear Tienda</p>
                    </Link>
                    <Link
                        href="/super-admin/users"
                        className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                    >
                        <Users className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Gestionar Usuarios</p>
                    </Link>
                    <Link
                        href="/super-admin/analytics"
                        className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                    >
                        <TrendingUp className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Ver Analytics</p>
                    </Link>
                    <Link
                        href="/super-admin/activity"
                        className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                    >
                        <Activity className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Logs de Actividad</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
