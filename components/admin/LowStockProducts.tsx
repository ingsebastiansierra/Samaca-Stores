import { createClient } from '@/lib/supabase/server'
import { AlertTriangle, Package } from 'lucide-react'
import Link from 'next/link'

export async function LowStockProducts({ storeId }: { storeId: string }) {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, stock, slug')
    .eq('store_id', storeId)
    .lte('stock', 5)
    .order('stock', { ascending: true })
    .limit(5)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-bold text-black">Stock Bajo</h2>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Todos los productos tienen stock suficiente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-black">{product.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  product.stock === 0
                    ? 'bg-red-100 text-red-800'
                    : product.stock <= 2
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.stock} unidades
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
