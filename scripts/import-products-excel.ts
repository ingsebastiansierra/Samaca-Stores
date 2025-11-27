/**
 * Script de ejemplo para importar productos desde Excel
 * 
 * Formato esperado del Excel:
 * | name | description | price | category | stock | images |
 * |------|-------------|-------|----------|-------|--------|
 * 
 * Uso:
 * 1. Instalar: npm install xlsx
 * 2. Preparar archivo Excel con el formato correcto
 * 3. Ejecutar desde el panel de super admin
 */

import * as XLSX from 'xlsx'

export interface ProductImport {
  name: string
  description?: string
  price: number
  category: string
  stock: number
  images?: string
}

export function parseExcelFile(file: File): Promise<ProductImport[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet) as any[]

        const products: ProductImport[] = json.map((row) => ({
          name: row.name || row.nombre || '',
          description: row.description || row.descripcion || '',
          price: parseFloat(row.price || row.precio || 0),
          category: row.category || row.categoria || 'General',
          stock: parseInt(row.stock || row.inventario || 0),
          images: row.images || row.imagen || '',
        }))

        resolve(products)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsBinaryString(file)
  })
}

export function validateProducts(products: ProductImport[]): {
  valid: ProductImport[]
  errors: Array<{ row: number; error: string }>
} {
  const valid: ProductImport[] = []
  const errors: Array<{ row: number; error: string }> = []

  products.forEach((product, index) => {
    const row = index + 2 // +2 porque Excel empieza en 1 y tiene header

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

// Ejemplo de uso en un componente:
/*
'use client'

import { parseExcelFile, validateProducts } from '@/scripts/import-products-excel'
import { importProductsFromExcel } from '@/lib/actions/super-admin'

export default function ImportProductsButton({ storeId }: { storeId: string }) {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const products = await parseExcelFile(file)
      const { valid, errors } = validateProducts(products)

      if (errors.length > 0) {
        console.error('Errores en el archivo:', errors)
        alert(`Se encontraron ${errors.length} errores. Revisa la consola.`)
        return
      }

      await importProductsFromExcel(storeId, valid)
      alert(`${valid.length} productos importados exitosamente`)
    } catch (error) {
      console.error('Error al importar:', error)
      alert('Error al importar productos')
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        className="hidden"
        id="excel-import"
      />
      <label
        htmlFor="excel-import"
        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Importar desde Excel
      </label>
    </div>
  )
}
*/
