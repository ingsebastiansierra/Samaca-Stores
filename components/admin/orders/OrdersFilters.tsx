'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function OrdersFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [status, setStatus] = useState(searchParams.get('status') || '')

    const handleSearch = (searchValue: string, statusValue: string) => {
        const params = new URLSearchParams()
        if (searchValue) params.set('search', searchValue)
        if (statusValue) params.set('status', statusValue)

        router.push(`/admin/orders?${params.toString()}`)
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            handleSearch(e.target.value, status)
                        }}
                        placeholder="Buscar por ticket, cliente, teléfono o monto..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm md:text-base"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        handleSearch(search, e.target.value)
                    }}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm md:text-base min-w-[200px]"
                >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Listo</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
            </div>
        </div>
    )
}
