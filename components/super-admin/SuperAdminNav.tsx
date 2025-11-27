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
    LogOut
} from 'lucide-react'

const navItems = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/stores', label: 'Tiendas', icon: Store },
    { href: '/super-admin/users', label: 'Usuarios', icon: Users },
    { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/super-admin/activity', label: 'Actividad', icon: Activity },
    { href: '/super-admin/settings', label: 'Configuración', icon: Settings },
]

export default function SuperAdminNav() {
    const pathname = usePathname()

    return (
        <nav className="bg-gray-900 text-white shadow-lg mt-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/super-admin/dashboard" className="text-xl font-bold">
                            🚀 Super Admin
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Salir</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
