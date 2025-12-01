import ImportProductsForm from '@/components/super-admin/ImportProductsForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ImportProductsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href={`/super-admin/stores/${params.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Importar Productos</h1>
                    <p className="text-gray-600 mt-1">Carga productos desde un archivo Excel</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <ImportProductsForm storeId={params.id} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900">📋 Formato del Excel</h3>
                    <a
                        href="/templates/productos-plantilla.csv"
                        download
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        📥 Descargar Plantilla
                    </a>
                </div>
                <p className="text-sm text-blue-800 mb-4">
                    El archivo Excel debe tener las siguientes columnas (en la primera fila):
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <div className="grid grid-cols-6 gap-2 font-bold text-gray-700 mb-2">
                        <div>name</div>
                        <div>description</div>
                        <div>price</div>
                        <div>category</div>
                        <div>stock</div>
                        <div>images</div>
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-gray-600">
                        <div>Camiseta</div>
                        <div>Camiseta azul</div>
                        <div>25000</div>
                        <div>Ropa</div>
                        <div>50</div>
                        <div>url_imagen</div>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-blue-800">
                    <p>• <strong>name</strong>: Nombre del producto (requerido)</p>
                    <p>• <strong>description</strong>: Descripción del producto (opcional)</p>
                    <p>• <strong>price</strong>: Precio en números (requerido)</p>
                    <p>• <strong>category</strong>: Categoría del producto (requerido)</p>
                    <p>• <strong>stock</strong>: Cantidad en inventario (requerido)</p>
                    <p>• <strong>images</strong>: URL de la imagen (opcional)</p>
                </div>
            </div>
        </div>
    )
}
