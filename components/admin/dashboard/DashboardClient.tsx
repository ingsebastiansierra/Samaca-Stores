'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp,
    ShoppingBag,
    AlertTriangle,
    Package,
    DollarSign,
    Users,
    Clock,
    Zap,
    ArrowUp,
    ArrowDown
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface DashboardClientProps {
    storeName: string
    todayTotal: number
    pendingQuotations: number
    lowStockProducts: number
    totalProducts: number
    weekSales: Array<{ total: number; created_at: string }>
    topProducts: Array<{ name: string; count: number }>
}

export function DashboardClient({
    storeName,
    todayTotal,
    pendingQuotations,
    lowStockProducts,
    totalProducts,
    weekSales,
    topProducts
}: DashboardClientProps) {
    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Buenos días')
        else if (hour < 19) setGreeting('Buenas tardes')
        else setGreeting('Buenas noches')
    }, [])

    // Procesar datos para el gráfico de ventas
    const salesByDay = weekSales.reduce((acc: Record<string, number>, sale) => {
        const date = new Date(sale.created_at).toLocaleDateString('es-CO', {
            weekday: 'short',
            day: 'numeric'
        })
        acc[date] = (acc[date] || 0) + sale.total
        return acc
    }, {})

    const chartData = {
        labels: Object.keys(salesByDay),
        datasets: [
            {
                label: 'Ventas',
                data: Object.values(salesByDay),
                borderColor: 'rgb(2, 132, 199)',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `$${context.parsed.y.toLocaleString('es-CO')}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `$${value.toLocaleString('es-CO')}`
                }
            }
        }
    }

    const barChartData = {
        labels: topProducts.map(p => p.name.substring(0, 20)),
        datasets: [
            {
                label: 'Unidades',
                data: topProducts.map(p => p.count),
                backgroundColor: 'rgba(2, 132, 199, 0.8)',
            }
        ]
    }

    const stats = [
        {
            title: 'Ventas Hoy',
            value: `$${todayTotal.toLocaleString('es-CO')}`,
            icon: DollarSign,
            color: 'bg-green-500',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Cotizaciones',
            value: pendingQuotations,
            icon: ShoppingBag,
            color: 'bg-yellow-500',
            subtitle: 'Pendientes'
        },
        {
            title: 'Stock Bajo',
            value: lowStockProducts,
            icon: AlertTriangle,
            color: 'bg-red-500',
            subtitle: 'Productos'
        },
        {
            title: 'Productos',
            value: totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            subtitle: 'Activos'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            {greeting}! 👋
                        </h1>
                        <p className="text-sky-100 text-sm md:text-base">
                            Bienvenido al panel de {storeName}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">
                            {new Date().toLocaleDateString('es-CO', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {stat.trend && (
                                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    {stat.trend}
                                </div>
                            )}
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                        {stat.subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Ventas de la Semana</h2>
                        <TrendingUp className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Productos Más Cotizados</h2>
                        <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="h-64">
                        {topProducts.length > 0 ? (
                            <Bar data={barChartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No hay datos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/admin/products/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-sky-600 hover:bg-sky-50 transition-colors"
                    >
                        <Package className="w-8 h-8 text-sky-600" />
                        <span className="text-sm font-semibold text-gray-700">Nuevo Producto</span>
                    </a>
                    <a
                        href="/admin/cotizaciones"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-600 hover:bg-yellow-50 transition-colors"
                    >
                        <ShoppingBag className="w-8 h-8 text-yellow-600" />
                        <span className="text-sm font-semibold text-gray-700">Ver Cotizaciones</span>
                    </a>
                    <a
                        href="/admin/products"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-red-600 hover:bg-red-50 transition-colors"
                    >
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <span className="text-sm font-semibold text-gray-700">Stock Bajo</span>
                    </a>
                    <a
                        href="/admin/stats"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-colors"
                    >
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">Reportes</span>
                    </a>
                </div>
            </div>

            {/* Insights */}
            {(pendingQuotations > 0 || lowStockProducts > 0) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Atención Requerida
                    </h2>
                    <div className="space-y-3">
                        {pendingQuotations > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                <p className="text-gray-700">
                                    Tienes <strong>{pendingQuotations} cotizaciones pendientes</strong> esperando respuesta
                                </p>
                            </div>
                        )}
                        {lowStockProducts > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <p className="text-gray-700">
                                    <strong>{lowStockProducts} productos</strong> tienen stock bajo y necesitan reabastecimiento
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
