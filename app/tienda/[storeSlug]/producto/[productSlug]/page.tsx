import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product/ProductDetail'

interface PageProps {
  params: Promise<{ 
    storeSlug: string
    productSlug: string 
  }>
}

export default async function ProductoPage({ params }: PageProps) {
  const { storeSlug, productSlug } = await params
  const supabase = await createClient()

  // Fetch store
  const { data: store } = await supabase
    .from('stores')
    .select('id, name, slug')
    .eq('slug', storeSlug)
    .eq('status', 'active')
    .single()

  if (!store) {
    notFound()
  }

  // Fetch product
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', productSlug)
    .eq('store_id', store.id)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  return <ProductDetail product={product} store={store} />
}
