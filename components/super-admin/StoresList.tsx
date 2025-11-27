'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateStoreStatus, deleteStore } from '@/lib/actions/super-admin'
import { Store, MapPin, Phone, Mail, TrendingUp, Package, ShoppingCart, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import type { StoreWithStats } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function StoresList({ stores }: { stores: StoreWithStats[] }) {
    const [storesList, setStoresList] = useState(stores)
    const [loading, setLoading] = useState<string | null>(null)

    const handleStatusChange = async (storeId: string, newStatus: 'active' | 'inactive' | 'closed') => {
        setLoading(storeId)
        try {
            await updateStoreStatus(storeId, newStatus)
            setStoresList(prev => prev.map(s =>
                s.id === storeId ? { ...s, status: newStatus } : s
            ))
            toast.success('Estado actualizado correctamente')
        } catch (error) {
            toast.error('Error al actualizar el estado')
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (storeId: string, storeName: string) => {
        if (!confirm(`¿Estás seguro de eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
            return
        }

        setLoading(storeId)
        try {
            await deleteStore(storeId)
            setStoresList(prev => prev.filter(s => s.id !== storeId))
            toast.success('Tienda eliminada correctamente')
        } catch (error) {
            toast.error('Error al eliminar la tienda')
        } finally {
            setLoading(null)
        }
    }

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
        <div className="space-y-4">
            {storesList.map((store) => (
                <div key={store.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                            <div className="bg-gray-900 text-white p-3 rounded-lg">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{store.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    {store.city && (
                                        <span className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{store.city}</span>
                                        </span>
                                    )}
                                    {store.phone && (
                                        <span className="flex items-center space-x-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{store.phone}</span>
                                        </span>
                                    )}
                                    {store.email && (
                                        <span className="flex items-center space-x-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{store.email}</span>
                                        </span>
                                    )}
                                </div>
                                {store.admin && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Admin: <span className="font-medium">{store.admin.full_name}</span> ({store.admin.email})
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(store.status)}`}>
                                {getStatusLabel(store.status)}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-blue-600 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-medium">Ventas</span>
                            </div>
                            <p className="text-lg font-bold text-blue-900">
                                ${(store.stats?.total_revenue || 0).toLocaleString('es-CO')}
                            </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-purple-600 mb-1">
                                <ShoppingCart className="w-4 h-4" />
                                <span className="text-xs font-medium">Pedidos</span>
                            </div>
                            <p className="text-lg font-bold text-purple-900">
                                {store.stats?.total_orders || 0}
                            </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-orange-600 mb-1">
                                <Package className="w-4 h-4" />
                                <span className="text-xs font-medium">Productos</span>
                            </div>
                            <p className="text-lg font-bold text-orange-900">
                                {store.stats?.total_products || 0}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <select
                                value={store.status}
                                onChange={(e) => handleStatusChange(store.id, e.target.value as any)}
                                disabled={loading === store.id}
                                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option value="active">Activa</option>
                                <option value="inactive">Inactiva</option>
                                <option value="closed">Cerrada</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={`/super-admin/stores/${store.id}`}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Ver Detalles</span>
                            </Link>
                            <Link
                                href={`/super-admin/stores/${store.id}/edit`}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Editar</span>
                            </Link>
                            <button
                                onClick={() => handleDelete(store.id, store.name)}
                                disabled={loading === store.id}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {storesList.length === 0 && (
                <div className="text-center py-12">
                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tiendas</h3>
                    <p className="text-gray-600 mb-4">Comienza creando tu primera tienda</p>
                    <Link
                        href="/super-admin/stores/new"
                        className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Crear Tienda
                    </Link>
                </div>
            )}
        </div>
    )
}
