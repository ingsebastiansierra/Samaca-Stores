'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Store,
    Users,
    BarChart3,
    Activity,
    Settings,
    Shield,
    X,
    LogOut
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/stores', label: 'Tiendas', icon: Store },
    { href: '/super-admin/users', label: 'Usuarios', icon: Users },
    { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/super-admin/activity', label: 'Actividad', icon: Activity },
    { href: '/super-admin/settings', label: 'Configuración', icon: Settings },
]

export function SuperAdminSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-gray-900 to-black text-white transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800">
                        <Link href="/super-admin/dashboard" className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-red-500" />
                            <div>
                                <h1 className="text-xl font-bold">Super Admin</h1>
                                <p className="text-xs text-gray-400">Control Total</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 lg:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={true}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <Store className="w-4 h-4" />
                            <span>Ver tienda pública</span>
                        </Link>
                        <Link
                            href="/api/auth/signout"
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 lg:hidden z-40 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-lg"
            >
                <Shield className="w-6 h-6" />
            </button>
        </>
    )
}
