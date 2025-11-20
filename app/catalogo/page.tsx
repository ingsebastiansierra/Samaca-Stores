import { createClient } from '@/lib/supabase/server'
import { CatalogClient } from './CatalogClient'

export const revalidate = 300 // Revalidar cada 5 minutos

export default async function CatalogoPage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      stores!inner (
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  const transformedProducts = products?.map(item => ({
    ...item,
    store: Array.isArray(item.stores) ? item.stores[0] : item.stores
  })) || []

  return <CatalogClient products={transformedProducts} />
}
