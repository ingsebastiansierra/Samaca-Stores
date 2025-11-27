'use client'

import { Shield, User, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-helpers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

export function SuperAdminHeader() {
    const router = useRouter()
    const [showMenu, setShowMenu] = useState(false)

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success('Sesión cerrada')
            window.location.href = '/'
        } catch (error) {
            toast.error('Error al cerrar sesión')
        }
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Super Administrador</h2>
                        <p className="text-xs text-gray-500">Control total de la plataforma</p>
                    </div>
                </div>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-xs text-gray-500">Super Admin</p>
                                    <p className="text-sm font-semibold text-gray-900">Sebastian Sierra</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-red-600"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
