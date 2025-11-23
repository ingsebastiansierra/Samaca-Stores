import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Package } from 'lucide-react'

export async function TopProducts({ storeId }: { storeId: string }) {
  const supabase = await createClient()

  // Obtener todos los pedidos pagados
  const { data: orders } = await supabase
    .from('orders')
    .select('items, payment_status')
    .eq('store_id', storeId)
    .eq('payment_status', 'paid')

  // Contar ventas por producto
  const productSales: Record<string, { name: string; price: number; count: number; revenue: number }> = {}

  orders?.forEach(order => {
    const items = order.items || []
    items.forEach((item: any) => {
      const productId = item.product_id || item.id
      if (!productSales[productId]) {
        productSales[productId] = {
          name: item.name,
          price: item.price,
          count: 0,
          revenue: 0
        }
      }
      productSales[productId].count += item.quantity
      productSales[productId].revenue += item.price * item.quantity
    })
  })

  // Convertir a array y ordenar por cantidad vendida
  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-green-500 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Productos Más Vendidos</h3>
          <p className="text-xs text-gray-500">Top 10 por unidades</p>
        </div>
      </div>

      {topProducts.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No hay ventas registradas aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600">
                    ${product.price.toLocaleString('es-CO')} • ${product.revenue.toLocaleString('es-CO')} en ventas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {product.count}
                </p>
                <p className="text-xs text-gray-600">unidades</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
