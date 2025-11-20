import { createClient } from '@/lib/supabase/server'
import { TrendingUp } from 'lucide-react'

export async function TopProducts({ storeId }: { storeId: string }) {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, stock, sales_count')
    .eq('store_id', storeId)
    .order('sales_count', { ascending: false })
    .limit(10)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-black">Productos Más Vendidos</h2>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay datos de ventas aún
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-black">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${product.price.toLocaleString('es-CO')} • Stock: {product.stock}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {product.sales_count || 0}
                </p>
                <p className="text-xs text-gray-600">ventas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
