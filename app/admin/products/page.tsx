import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductsClient } from '@/components/admin/products/ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  // Obtener productos iniciales
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  // Obtener categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('store_id', store.id)

  // Mapear categorías a productos
  const productsWithCategories = products?.map(product => ({
    ...product,
    categories: categories?.find(cat => cat.id === product.category_id) || null
  }))

  return <ProductsClient initialProducts={productsWithCategories || []} storeId={store.id} />
}
