import { getStoreDetails } from '@/lib/actions/super-admin'
import Link from 'next/link'
import { ArrowLeft, Store, MapPin, Phone, Mail, TrendingUp, Package, ShoppingCart, Users } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function StoreDetailsPage({ params }: { params: { id: string } }) {
    try {
        const { store, products, recentOrders, stats } = await getStoreDetails(params.id)

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'active': return 'bg-green-100 text-green-800'
                case 'inactive': return 'bg-yellow-100 text-yellow-800'
                case 'closed': return 'bg-red-100 text-red-800'
                default: return 'bg-gray-100 text-gray-800'
            }
        }

        const getStatusLabel = (status: string) => {
            switch (status) {
                case 'active': return 'Activa'
                case 'inactive': return 'Inactiva'
                case 'closed': return 'Cerrada'
                default: return status
            }
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/super-admin/stores"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                        <p className="text-gray-600 mt-1">{store.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(store.status)}`}>
                        {getStatusLabel(store.status)}
                    </span>
                </div>

                {/* Store Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Tienda</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Ubicación</p>
                                <p className="font-medium">{store.city}</p>
                                {store.address && <p className="text-sm text-gray-600">{store.address}</p>}
                            </div>
                        </div>
                        {store.phone && (
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Teléfono</p>
                                    <p className="font-medium">{store.phone}</p>
                                </div>
                            </div>
                        )}
                        {store.email && (
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{store.email}</p>
                                </div>
                            </div>
                        )}
                        {store.admin && (
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Administrador</p>
                                    <p className="font-medium">{store.admin.full_name}</p>
                                    <p className="text-sm text-gray-600">{store.admin.email}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Ingresos Totales</p>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ${(stats?.total_revenue || 0).toLocaleString('es-CO')}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Pedidos</p>
                            <ShoppingCart className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_orders || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Productos</p>
                            <Package className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_products || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Ticket Promedio</p>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ${(stats?.avg_order_value || 0).toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recientes</h2>
                    {recentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">#{order.ticket}</p>
                                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${order.total.toLocaleString('es-CO')}</p>
                                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No hay pedidos recientes</p>
                    )}
                </div>

                {/* Products Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Productos</h2>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/super-admin/stores/${params.id}/import`}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                📊 Importar Excel
                            </Link>
                            <Link
                                href={`/super-admin/stores/${params.id}/products`}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Ver todos →
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm text-green-600 font-medium">Disponibles</p>
                            <p className="text-2xl font-bold text-green-900">
                                {products.filter(p => p.status === 'available').length}
                            </p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-sm text-yellow-600 font-medium">Stock Bajo</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {products.filter(p => p.status === 'low_stock').length}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-sm text-red-600 font-medium">Agotados</p>
                            <p className="text-2xl font-bold text-red-900">
                                {products.filter(p => p.status === 'out_of_stock').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        notFound()
    }
}
