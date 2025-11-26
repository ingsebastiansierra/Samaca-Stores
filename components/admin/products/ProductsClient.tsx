'use client'

import { useState } from 'react'
import { ProductsTable } from '@/components/admin/products/ProductsTable'
import { ProductsFilters } from '@/components/admin/products/ProductsFilters'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface ProductsClientProps {
    initialProducts: any[]
    storeId: string
    categories: Array<{ id: string; name: string }>
}

export function ProductsClient({ initialProducts, storeId, categories }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-black">Productos</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Gestiona el inventario de tu tienda</p>
                </div>
                <Link href="/admin/products/new">
                    <button className="flex items-center gap-2 bg-black text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm md:text-base w-full md:w-auto justify-center">
                        <Plus className="w-5 h-5" />
                        Nuevo Producto
                    </button>
                </Link>
            </div>

            <ProductsFilters storeId={storeId} onProductsChange={setProducts} />

            <ProductsTable products={products} categories={categories} />
        </div>
    )
}
