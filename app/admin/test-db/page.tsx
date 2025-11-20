import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Test 1: Get store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  // Test 2: Get products (simple query)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('store_id', store?.id || '')
    .limit(5)

  // Test 3: Count products
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store?.id || '')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Test</h1>
      
      {/* User Info */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">User Info</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>

      {/* Store Test */}
      <div className="mb-6 p-4 bg-blue-100 rounded">
        <h2 className="font-bold mb-2">Store Test</h2>
        {storeError ? (
          <div className="text-red-600">
            <p>Error: {storeError.message}</p>
            <p>Code: {storeError.code}</p>
            <pre className="text-xs mt-2">{JSON.stringify(storeError, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p>✅ Store found</p>
            <p>Store ID: {store?.id}</p>
            <p>Store Name: {store?.name}</p>
          </div>
        )}
      </div>

      {/* Products Test */}
      <div className="mb-6 p-4 bg-green-100 rounded">
        <h2 className="font-bold mb-2">Products Test</h2>
        {productsError ? (
          <div className="text-red-600">
            <p className="font-bold">❌ Error loading products</p>
            <p>Message: {productsError.message}</p>
            <p>Code: {productsError.code}</p>
            <p>Details: {productsError.details || 'N/A'}</p>
            <p>Hint: {productsError.hint || 'N/A'}</p>
            <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
              {JSON.stringify(productsError, null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <p>✅ Products loaded</p>
            <p>Count: {products?.length || 0}</p>
            <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Count Test */}
      <div className="mb-6 p-4 bg-yellow-100 rounded">
        <h2 className="font-bold mb-2">Count Test</h2>
        {countError ? (
          <div className="text-red-600">
            <p>Error: {countError.message}</p>
            <p>Code: {countError.code}</p>
            <pre className="text-xs mt-2">{JSON.stringify(countError, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p>✅ Count successful</p>
            <p>Total products: {count}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <a href="/admin/products" className="text-blue-600 underline">
          ← Volver a productos
        </a>
      </div>
    </div>
  )
}
