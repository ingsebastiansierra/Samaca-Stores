'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProductsFiltersProps {
    storeId: string
    onProductsChange: (products: any[]) => void
}

export function ProductsFilters({ storeId, onProductsChange }: ProductsFiltersProps) {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        searchProducts(search)
    }, [search])

    async function searchProducts(searchTerm: string) {
        setLoading(true)
        try {
            let query = supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false })

            if (searchTerm) {
                // Buscar en múltiples campos: nombre, descripción, SKU, precio
                const isNumeric = !isNaN(Number(searchTerm.replace(/[,$]/g, '')))

                if (isNumeric) {
                    // Si es número, buscar en precio y SKU también
                    query = query.or(
                        `name.ilike.%${searchTerm}%,` +
                        `description.ilike.%${searchTerm}%,` +
                        `sku.ilike.%${searchTerm}%,` +
                        `price.eq.${searchTerm.replace(/[,$]/g, '')}`
                    )
                } else {
                    // Solo buscar en campos de texto
                    query = query.or(
                        `name.ilike.%${searchTerm}%,` +
                        `description.ilike.%${searchTerm}%,` +
                        `sku.ilike.%${searchTerm}%`
                    )
                }
            }

            const { data: products } = await query

            // Obtener categorías
            const { data: categories } = await supabase
                .from('categories')
                .select('id, name')
                .eq('store_id', storeId)

            // Mapear categorías a productos
            const productsWithCategories = products?.map(product => ({
                ...product,
                categories: categories?.find(cat => cat.id === product.category_id) || null
            }))

            onProductsChange(productsWithCategories || [])
        } catch (error) {
            console.error('Error searching products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, descripción, SKU o precio..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm md:text-base"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>
        </div>
    )
}
