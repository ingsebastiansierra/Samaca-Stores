'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { importProductsFromExcel } from '@/lib/actions/super-admin'
import { Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductImport {
    name: string
    description?: string
    price: number
    category: string
    stock: number
    images?: string
}

export default function ImportProductsForm({ storeId }: { storeId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<ProductImport[]>([])
    const [errors, setErrors] = useState<Array<{ row: number; error: string }>>([])

    const parseExcel = async (file: File): Promise<ProductImport[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string
                    const lines = text.split('\n').filter(line => line.trim())

                    if (lines.length < 2) {
                        throw new Error('El archivo debe tener al menos una fila de datos')
                    }

                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
                    const products: ProductImport[] = []

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim())
                        const product: any = {}

                        headers.forEach((header, index) => {
                            product[header] = values[index] || ''
                        })

                        products.push({
                            name: product.name || product.nombre || '',
                            description: product.description || product.descripcion || '',
                            price: parseFloat(product.price || product.precio || '0'),
                            category: product.category || product.categoria || 'General',
                            stock: parseInt(product.stock || product.inventario || '0'),
                            images: product.images || product.imagen || '',
                        })
                    }

                    resolve(products)
                } catch (error: any) {
                    reject(error)
                }
            }

            reader.onerror = () => reject(reader.error)
            reader.readAsText(file)
        })
    }

    const validateProducts = (products: ProductImport[]) => {
        const valid: ProductImport[] = []
        const errors: Array<{ row: number; error: string }> = []

        products.forEach((product, index) => {
            const row = index + 2

            if (!product.name || product.name.trim() === '') {
                errors.push({ row, error: 'Nombre es requerido' })
                return
            }

            if (!product.price || product.price <= 0) {
                errors.push({ row, error: 'Precio debe ser mayor a 0' })
                return
            }

            if (!product.category || product.category.trim() === '') {
                errors.push({ row, error: 'Categoría es requerida' })
                return
            }

            if (product.stock < 0) {
                errors.push({ row, error: 'Stock no puede ser negativo' })
                return
            }

            valid.push(product)
        })

        return { valid, errors }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setLoading(true)
            const products = await parseExcel(file)
            const { valid, errors } = validateProducts(products)

            setPreview(valid)
            setErrors(errors)

            if (errors.length > 0) {
                toast.error(`Se encontraron ${errors.length} errores en el archivo`)
            } else {
                toast.success(`${valid.length} productos listos para importar`)
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al leer el archivo')
            setPreview([])
            setErrors([])
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async () => {
        if (preview.length === 0) {
            toast.error('No hay productos para importar')
            return
        }

        setLoading(true)
        try {
            await importProductsFromExcel(storeId, preview)
            toast.success(`${preview.length} productos importados exitosamente`)
            router.push(`/super-admin/stores/${storeId}`)
        } catch (error: any) {
            toast.error(error.message || 'Error al importar productos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selecciona un archivo CSV o Excel
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Formatos soportados: .csv, .xlsx, .xls
                </p>
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : 'Seleccionar Archivo'}
                </label>
            </div>

            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">
                            Errores encontrados ({errors.length})
                        </h4>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {errors.map((error, index) => (
                            <p key={index} className="text-sm text-red-800">
                                Fila {error.row}: {error.error}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {preview.length > 0 && (
                <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">
                                {preview.length} productos válidos listos para importar
                            </h4>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900">Vista Previa</h4>
                        </div>
                        <div className="overflow-x-auto max-h-96">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Precio</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Categoría</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {preview.slice(0, 10).map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">${product.price.toLocaleString()}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{product.category}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {preview.length > 10 && (
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
                                    Mostrando 10 de {preview.length} productos
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                setPreview([])
                                setErrors([])
                            }}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={loading || errors.length > 0}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Importando...' : `Importar ${preview.length} Productos`}
                        </button>
                    </div>
                </>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Nota importante:</p>
                        <p>Los productos se agregarán a la tienda. Si un producto ya existe con el mismo nombre, se creará uno nuevo.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
