import { getUserProfile } from '@/lib/auth/roles'
import { Shield } from 'lucide-react'

export default async function SettingsPage() {
    const profile = await getUserProfile()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600 mt-1">Configuración del super administrador</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-red-100 p-3 rounded-lg">
                        <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Perfil de Super Administrador</h2>
                        <p className="text-sm text-gray-600">Información de tu cuenta</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                        <p className="text-lg font-semibold text-gray-900">{profile?.full_name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-lg font-semibold text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            Super Administrador
                        </span>
                    </div>
                    {profile?.profession && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profesión</label>
                            <p className="text-lg font-semibold text-gray-900">{profile.profession}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg shadow-md p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Permisos de Super Administrador</h2>
                <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Acceso completo a todas las tiendas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Crear, editar y eliminar tiendas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Gestionar usuarios y roles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Ver analytics y estadísticas globales</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Monitorear actividad de la plataforma</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Importar y exportar datos</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
