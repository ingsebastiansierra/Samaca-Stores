'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Search, Filter, Download, CheckSquare, Square, FileText, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { generateCatalogPDF } from '@/lib/utils/pdf-generator'
import toast from 'react-hot-toast'

interface Product {
    id: string
    name: string
    price: number
    images: string[]
    gender?: string
    product_type?: string
    category_id?: string
}

interface CatalogGeneratorProps {
    products: Product[]
    storeName: string
    storePhone?: string
}

export function CatalogGenerator({ products, storeName, storePhone }: CatalogGeneratorProps) {
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [genderFilter, setGenderFilter] = useState<string>('all')
    const [generating, setGenerating] = useState(false)

    // Filtrar productos
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesGender = genderFilter === 'all' || product.gender === genderFilter
            return matchesSearch && matchesGender
        })
    }, [products, searchTerm, genderFilter])

    // Manejar selección
    const toggleProduct = (id: string) => {
        const newSelected = new Set(selectedProducts)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedProducts(newSelected)
    }

    const toggleAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set())
        } else {
            const newSelected = new Set(filteredProducts.map(p => p.id))
            setSelectedProducts(newSelected)
        }
    }

    // Generar PDF
    const handleGeneratePDF = async () => {
        if (selectedProducts.size === 0) {
            toast.error('Selecciona al menos un producto')
            return
        }

        setGenerating(true)
        try {
            const selectedItems = products.filter(p => selectedProducts.has(p.id))

            // Agrupar productos por tipo de producto (blusas, camisas, pantalones, jeans, etc.)
            const categories = new Map<string, typeof selectedItems>()

            selectedItems.forEach(product => {
                const categoryName = product.product_type
                    ? product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)
                    : 'Otros Productos'

                if (!categories.has(categoryName)) {
                    categories.set(categoryName, [])
                }
                categories.get(categoryName)!.push(product)
            })

            // Convertir a formato esperado por generateCatalogPDF
            const categoriesArray = Array.from(categories.entries()).map(([name, items]) => ({
                name,
                items: items.map(p => ({
                    name: p.name,
                    price: p.price,
                    image: p.images?.[0],
                    description: ''
                }))
            }))

            const doc = await generateCatalogPDF({
                storeName,
                storePhone,
                categories: categoriesArray,
                title: `Catálogo ${genderFilter !== 'all' ? genderFilter.toUpperCase() : 'GENERAL'}`,
                subtitle: `${selectedProducts.size} Productos Seleccionados`
            })

            doc.save(`catalogo-${storeName.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`)
            toast.success('Catálogo generado exitosamente')
        } catch (error) {
            console.error('Error generando PDF:', error)
            toast.error('Error al generar el catálogo')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filtros y Controles */}
            <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400 w-4 h-4" />
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                        >
                            <option value="all">Todos los géneros</option>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0">
                    <span className="text-sm text-gray-500 font-medium">
                        {selectedProducts.size} seleccionados
                    </span>
                    <Button
                        onClick={handleGeneratePDF}
                        disabled={selectedProducts.size === 0 || generating}
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                    >
                        {generating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Generar PDF
                    </Button>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Productos Disponibles ({filteredProducts.length})</h2>
                    <Button variant="ghost" size="sm" onClick={toggleAll} className="text-sky-600 hover:text-sky-700">
                        {selectedProducts.size === filteredProducts.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    {filteredProducts.map(product => {
                        const isSelected = selectedProducts.has(product.id)
                        return (
                            <div
                                key={product.id}
                                onClick={() => toggleProduct(product.id)}
                                className={`
                  relative group cursor-pointer border rounded-lg overflow-hidden transition-all duration-200
                  ${isSelected ? 'ring-2 ring-sky-500 border-transparent bg-sky-50' : 'hover:border-gray-300 bg-white'}
                `}
                            >
                                {/* Checkbox Overlay */}
                                <div className="absolute top-2 right-2 z-10">
                                    {isSelected ? (
                                        <div className="bg-sky-500 text-white rounded-md p-1 shadow-sm">
                                            <CheckSquare className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="bg-white/80 text-gray-400 rounded-md p-1 shadow-sm group-hover:text-gray-600">
                                            <Square className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Imagen */}
                                <div className="relative aspect-square bg-gray-100">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <FileText className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-gray-900">
                                            ${product.price.toLocaleString()}
                                        </p>
                                        {product.gender && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                                                {product.gender}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No se encontraron productos con los filtros actuales.
                    </div>
                )}
            </div>
        </div>
    )
}
