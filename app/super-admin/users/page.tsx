import { getAllUsers } from '@/lib/actions/super-admin'
import UsersList from '@/components/super-admin/UsersList'

export default async function UsersPage() {
    const users = await getAllUsers()

    const stats = {
        total: users.length,
        superAdmins: users.filter(u => u.role === 'super_admin').length,
        storeAdmins: users.filter(u => u.role === 'store_admin').length,
        regularUsers: users.filter(u => u.role === 'user').length,
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-gray-600 mt-1">Administra todos los usuarios de la plataforma</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-red-50 rounded-lg shadow-md p-6">
                    <p className="text-sm text-red-600 mb-1">Super Admins</p>
                    <p className="text-3xl font-bold text-red-900">{stats.superAdmins}</p>
                </div>
                <div className="bg-blue-50 rounded-lg shadow-md p-6">
                    <p className="text-sm text-blue-600 mb-1">Admins de Tienda</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.storeAdmins}</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow-md p-6">
                    <p className="text-sm text-green-600 mb-1">Usuarios</p>
                    <p className="text-3xl font-bold text-green-900">{stats.regularUsers}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <UsersList users={users} />
            </div>
        </div>
    )
}
