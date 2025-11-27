'use client'

import { useState } from 'react'
import { updateUserRole, toggleUserStatus } from '@/lib/actions/super-admin'
import { User, Mail, Briefcase, Shield, ShieldCheck, UserCircle, Ban, CheckCircle } from 'lucide-react'
import type { UserProfile } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function UsersList({ users }: { users: UserProfile[] }) {
    const [usersList, setUsersList] = useState(users)
    const [loading, setLoading] = useState<string | null>(null)

    const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'store_admin' | 'user', currentRole: string, userName: string) => {
        // Obtener el nombre del rol en español
        const getRoleName = (role: string) => {
            switch (role) {
                case 'super_admin': return 'Super Administrador'
                case 'store_admin': return 'Administrador de Tienda'
                case 'user': return 'Usuario'
                default: return role
            }
        }

        // Primera confirmación
        const confirmFirst = window.confirm(
            `⚠️ CAMBIO DE ROL\n\n` +
            `Usuario: ${userName}\n` +
            `Rol actual: ${getRoleName(currentRole)}\n` +
            `Nuevo rol: ${getRoleName(newRole)}\n\n` +
            `¿Estás seguro de que quieres cambiar el rol?`
        )

        if (!confirmFirst) {
            // Revertir el select al valor original
            const selectElement = document.querySelector(`select[data-user-id="${userId}"]`) as HTMLSelectElement
            if (selectElement) {
                selectElement.value = currentRole
            }
            return
        }

        // Segunda confirmación (más seria)
        const confirmSecond = window.confirm(
            `🚨 CONFIRMACIÓN FINAL\n\n` +
            `Esta acción cambiará el rol de:\n` +
            `${userName}\n\n` +
            `De: ${getRoleName(currentRole)}\n` +
            `A: ${getRoleName(newRole)}\n\n` +
            `¿CONFIRMAS este cambio?`
        )

        if (!confirmSecond) {
            // Revertir el select al valor original
            const selectElement = document.querySelector(`select[data-user-id="${userId}"]`) as HTMLSelectElement
            if (selectElement) {
                selectElement.value = currentRole
            }
            return
        }

        setLoading(userId)
        try {
            await updateUserRole(userId, newRole)
            setUsersList(prev => prev.map(u =>
                u.user_id === userId ? { ...u, role: newRole } : u
            ))
            toast.success(`✅ Rol actualizado a ${getRoleName(newRole)}`)
        } catch (error) {
            toast.error('❌ Error al actualizar el rol')
            // Revertir el select al valor original
            const selectElement = document.querySelector(`select[data-user-id="${userId}"]`) as HTMLSelectElement
            if (selectElement) {
                selectElement.value = currentRole
            }
        } finally {
            setLoading(null)
        }
    }

    const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
        const newStatus = !currentStatus
        const action = newStatus ? 'habilitar' : 'deshabilitar'

        // Primera confirmación
        const confirmFirst = window.confirm(
            `⚠️ ${action.toUpperCase()} USUARIO\n\n` +
            `Usuario: ${userName}\n` +
            `Estado actual: ${currentStatus ? 'Activo' : 'Inactivo'}\n` +
            `Nuevo estado: ${newStatus ? 'Activo' : 'Inactivo'}\n\n` +
            `¿Estás seguro de que quieres ${action} este usuario?`
        )

        if (!confirmFirst) return

        // Segunda confirmación
        const confirmSecond = window.confirm(
            `🚨 CONFIRMACIÓN FINAL\n\n` +
            `Esta acción ${newStatus ? 'HABILITARÁ' : 'DESHABILITARÁ'} a:\n` +
            `${userName}\n\n` +
            `${newStatus ? '✅ El usuario podrá iniciar sesión' : '❌ El usuario NO podrá iniciar sesión'}\n\n` +
            `¿CONFIRMAS este cambio?`
        )

        if (!confirmSecond) return

        setLoading(userId)
        try {
            await toggleUserStatus(userId, newStatus)
            setUsersList(prev => prev.map(u =>
                u.user_id === userId ? { ...u, is_active: newStatus } : u
            ))
            toast.success(`✅ Usuario ${newStatus ? 'habilitado' : 'deshabilitado'} correctamente`)
        } catch (error) {
            toast.error('❌ Error al cambiar el estado del usuario')
        } finally {
            setLoading(null)
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin': return <ShieldCheck className="w-5 h-5 text-red-500" />
            case 'store_admin': return <Shield className="w-5 h-5 text-blue-500" />
            default: return <UserCircle className="w-5 h-5 text-green-500" />
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'bg-red-100 text-red-800'
            case 'store_admin': return 'bg-blue-100 text-blue-800'
            default: return 'bg-green-100 text-green-800'
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'super_admin': return 'Super Admin'
            case 'store_admin': return 'Admin Tienda'
            default: return 'Usuario'
        }
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Profesión
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Registro
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersList.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-full">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.full_name}</p>
                                            <p className="text-sm text-gray-600 flex items-center space-x-1">
                                                <Mail className="w-3 h-3" />
                                                <span>{user.email}</span>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        {getRoleIcon(user.role)}
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.profession ? (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{user.profession}</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.is_active !== false ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <Ban className="w-3 h-3 mr-1" />
                                            Inactivo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={user.role}
                                            data-user-id={user.user_id}
                                            onChange={(e) => handleRoleChange(user.user_id, e.target.value as any, user.role, user.full_name)}
                                            disabled={loading === user.user_id}
                                            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                                        >
                                            <option value="user">Usuario</option>
                                            <option value="store_admin">Admin Tienda</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                        <button
                                            onClick={() => handleToggleStatus(user.user_id, user.is_active !== false, user.full_name)}
                                            disabled={loading === user.user_id}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${user.is_active !== false
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            title={user.is_active !== false ? 'Deshabilitar usuario' : 'Habilitar usuario'}
                                        >
                                            {user.is_active !== false ? (
                                                <>
                                                    <Ban className="w-4 h-4 inline mr-1" />
                                                    Deshabilitar
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Habilitar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {usersList.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay usuarios</h3>
                    <p className="text-gray-600">Los usuarios aparecerán aquí cuando se registren</p>
                </div>
            )}
        </div>
    )
}
