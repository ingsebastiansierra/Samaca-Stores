import { createClient } from './server'

// Funciones con revalidación automática de Next.js
// No usamos unstable_cache porque no es compatible con cookies()

export async function getCachedFeaturedProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      images,
      store_id,
      stores!inner (
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .limit(8)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCachedTrendingProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      images,
      store_id,
      stores!inner (
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4)

  if (error) throw error
  return data
}

export async function getCachedFeaturedStores() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('status', 'active')
    .limit(3)

  if (error) throw error
  return data
}
