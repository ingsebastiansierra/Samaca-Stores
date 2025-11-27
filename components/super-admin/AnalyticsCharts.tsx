'use client'

import { Bar, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

export default function AnalyticsCharts({ stats }: { stats: any }) {
    const salesByMonthData = {
        labels: Object.keys(stats.salesByMonth),
        datasets: [
            {
                label: 'Ventas por Mes',
                data: Object.values(stats.salesByMonth),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    }

    const usersByRoleData = {
        labels: ['Super Admins', 'Admins de Tienda', 'Usuarios'],
        datasets: [
            {
                data: [
                    stats.usersByRole.super_admin,
                    stats.usersByRole.store_admin,
                    stats.usersByRole.user,
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ventas por Mes</h2>
                <div className="h-80">
                    <Bar data={salesByMonthData} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios por Rol</h2>
                <div className="h-80 flex items-center justify-center">
                    <Doughnut data={usersByRoleData} options={chartOptions} />
                </div>
            </div>
        </div>
    )
}
