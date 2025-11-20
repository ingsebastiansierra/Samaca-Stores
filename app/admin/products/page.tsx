import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductsTable } from '@/components/admin/products/ProductsTable'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  // Obtener productos (sin JOIN para evitar problemas de RLS)
  let query = supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: products, error: productsError } = await query

  // Obtener categorías por separado
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('store_id', store.id)

  // Mapear categorías a productos
  const productsWithCategories = products?.map(product => ({
    ...product,
    categories: categories?.find(cat => cat.id === product.category_id) || null
  }))

  // Debug info
  console.log('Store ID:', store.id)
  console.log('Products count:', products?.length)
  console.log('Products error:', productsError)
  console.log('User ID:', user.id)
  console.log('Products data:', products)
  
  // Log error details
  if (productsError) {
    console.error('Error completo:', JSON.stringify(productsError, null, 2))
  }

  return (
    <div className="space-y-6">
      {/* Debug Info Visible */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm font-bold text-blue-900 mb-2">🔍 Debug Info:</p>
        <div className="text-xs text-blue-800 space-y-1">
          <p>User ID: {user.id}</p>
          <p>Store ID: {store.id}</p>
          <p>Products Count: {products?.length || 0}</p>
          <p>Has Error: {productsError ? 'YES' : 'NO'}</p>
          {productsError && (
            <div className="mt-2 p-2 bg-red-100 rounded">
              <p className="text-red-800 font-bold">Error Code: {productsError.code}</p>
              <p className="text-red-700">Message: {productsError.message}</p>
              <p className="text-red-600 text-xs mt-1">Details: {productsError.details || 'N/A'}</p>
              <p className="text-red-600 text-xs">Hint: {productsError.hint || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu inventario de productos
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="search"
            placeholder="Buscar productos..."
            defaultValue={params.search}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          />
        </form>
      </div>

      {/* Error Info */}
      {productsError && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            Error al cargar productos: {productsError.message}
          </p>
        </div>
      )}

      {/* Table */}
      <ProductsTable 
        products={productsWithCategories || []} 
        storeId={store.id}
        categories={categories || []}
      />
    </div>
  )
}
