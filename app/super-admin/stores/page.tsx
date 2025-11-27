import { getAllStores } from '@/lib/actions/super-admin'
import StoresList from '@/components/super-admin/StoresList'
import Link from 'next/link'

export default async function StoresPage() {
    const stores = await getAllStores()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Tiendas</h1>
                    <p className="text-gray-600 mt-1">Administra todas las tiendas de la plataforma</p>
                </div>
                <Link
                    href="/super-admin/stores/new"
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    + Nueva Tienda
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Total Tiendas</p>
                        <p className="text-2xl font-bold text-blue-900">{stores.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">Activas</p>
                        <p className="text-2xl font-bold text-green-900">
                            {stores.filter(s => s.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-yellow-600 font-medium">Inactivas</p>
                        <p className="text-2xl font-bold text-yellow-900">
                            {stores.filter(s => s.status === 'inactive').length}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-red-600 font-medium">Cerradas</p>
                        <p className="text-2xl font-bold text-red-900">
                            {stores.filter(s => s.status === 'closed').length}
                        </p>
                    </div>
                </div>

                <StoresList stores={stores} />
            </div>
        </div>
    )
}
