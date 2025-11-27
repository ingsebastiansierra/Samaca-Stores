import { getActivityLogs } from '@/lib/actions/super-admin'
import { Activity, User, Store, Package, ShoppingCart, Settings } from 'lucide-react'

export default async function ActivityPage() {
    const logs = await getActivityLogs(100)

    const getActionIcon = (entityType: string) => {
        switch (entityType) {
            case 'user': return <User className="w-5 h-5" />
            case 'store': return <Store className="w-5 h-5" />
            case 'product': return <Package className="w-5 h-5" />
            case 'order': return <ShoppingCart className="w-5 h-5" />
            default: return <Settings className="w-5 h-5" />
        }
    }

    const getActionColor = (action: string) => {
        if (action.includes('create')) return 'bg-green-100 text-green-800'
        if (action.includes('update')) return 'bg-blue-100 text-blue-800'
        if (action.includes('delete')) return 'bg-red-100 text-red-800'
        return 'bg-gray-100 text-gray-800'
    }

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            create: 'Creó',
            update: 'Actualizó',
            delete: 'Eliminó',
            update_status: 'Cambió estado',
            update_role: 'Cambió rol',
            import_products: 'Importó productos',
        }
        return labels[action] || action
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Registro de Actividad</h1>
                <p className="text-gray-600 mt-1">Monitoreo de todas las acciones en la plataforma</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <Activity className="w-6 h-6 text-gray-900" />
                    <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
                </div>

                <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                {getActionIcon(log.entity_type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                                        {getActionLabel(log.action)}
                                    </span>
                                    <span className="text-sm text-gray-600">{log.entity_type}</span>
                                </div>
                                {log.details && (
                                    <div className="text-sm text-gray-700 mt-1">
                                        {Object.entries(log.details).map(([key, value]) => (
                                            <span key={key} className="mr-3">
                                                <span className="font-medium">{key}:</span> {String(value)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(log.created_at).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {logs.length === 0 && (
                    <div className="text-center py-12">
                        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay actividad</h3>
                        <p className="text-gray-600">Los registros de actividad aparecerán aquí</p>
                    </div>
                )}
            </div>
        </div>
    )
}
