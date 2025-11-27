import { getGlobalStats } from '@/lib/actions/super-admin'
import AnalyticsCharts from '@/components/super-admin/AnalyticsCharts'

export default async function AnalyticsPage() {
    const stats = await getGlobalStats()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Global</h1>
                <p className="text-gray-600 mt-1">Análisis completo de la plataforma</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString('es-CO')}</p>
                    <p className="text-xs opacity-75 mt-2">Todas las tiendas</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Tiendas Activas</p>
                    <p className="text-3xl font-bold">{stats.activeStores}</p>
                    <p className="text-xs opacity-75 mt-2">de {stats.totalStores} totales</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Pedidos Totales</p>
                    <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-2">Todas las tiendas</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Productos</p>
                    <p className="text-3xl font-bold">{stats.totalProducts.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-2">En inventario</p>
                </div>
            </div>

            <AnalyticsCharts stats={stats} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Tiendas por Ventas</h2>
                <div className="space-y-4">
                    {stats.topStores.map((store, index) => {
                        const maxSales = stats.topStores[0]?.total_sales || 1
                        const percentage = ((store.total_sales || 0) / maxSales) * 100

                        return (
                            <div key={store.id}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-bold text-sm">
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
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
