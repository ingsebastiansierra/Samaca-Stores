import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StorePageClient } from '@/components/store/StorePageClient'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params
  const supabase = await createClient()

  // Fetch store data
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', storeSlug)
    .eq('status', 'active')
    .single()

  if (error || !store) {
    notFound()
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('display_order')

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <StorePageClient 
      store={store}
      categories={categories || []}
      products={products || []}
      storeSlug={storeSlug}
    />
  )
}
