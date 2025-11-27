'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/auth/roles'
import { revalidatePath } from 'next/cache'
import type { StoreWithStats, UserProfile, ActivityLog } from '@/lib/types/database.types'

// ============= STORES =============

export async function getAllStores(): Promise<StoreWithStats[]> {
  await requireSuperAdmin()
  const supabase = await createClient()

  console.log('🔍 [getAllStores] Consultando tiendas...')

  // Primero obtener las tiendas
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })

  if (storesError) {
    console.error('❌ [getAllStores] Error al obtener tiendas:', storesError)
    throw storesError
  }

  console.log('✅ [getAllStores] Tiendas obtenidas:', stores?.length)

  // Luego obtener stats y admin info para cada tienda
  const storesWithData = await Promise.all(
    (stores || []).map(async (store) => {
      // Obtener stats
      const { data: stats } = await supabase
        .from('store_stats')
        .select('*')
        .eq('store_id', store.id)
        .maybeSingle()

      // Obtener admin info
      const { data: admin } = await supabase
        .from('user_profiles')
        .select('email, full_name')
        .eq('user_id', store.user_id)
        .maybeSingle()

      return {
        ...store,
        stats,
        admin
      }
    })
  )

  console.log('✅ [getAllStores] Tiendas con datos:', storesWithData.length)
  return storesWithData as StoreWithStats[]
}

export async function getStoreDetails(storeId: string) {
  await requireSuperAdmin()
  const supabase = await createClient()

  const [storeResult, productsResult, quotationsResult, statsResult] = await Promise.all([
    supabase.from('stores').select('*, admin:user_profiles!stores_user_id_fkey(*)').eq('id', storeId).single(),
    supabase.from('products').select('*').eq('store_id', storeId),
    supabase.from('quotations').select('*').eq('store_id', storeId).order('created_at', { ascending: false }).limit(10),
    supabase.from('store_stats').select('*').eq('store_id', storeId).single()
  ])

  if (storeResult.error) throw storeResult.error

  return {
    store: storeResult.data,
    products: productsResult.data || [],
    recentOrders: quotationsResult.data || [],
    stats: statsResult.data
  }
}

export async function createStore(formData: FormData) {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Crear usuario para la tienda
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const adminName = formData.get('admin_name') as string

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) throw authError

  // Crear perfil de usuario
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: authData.user.id,
      email,
      full_name: adminName,
      role: 'store_admin'
    })

  if (profileError) throw profileError

  // Crear tienda
  const storeData = {
    user_id: authData.user.id,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    address: formData.get('address') as string || null,
    city: formData.get('city') as string,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    email: email,
    status: 'active'
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .insert(storeData)
    .select()
    .single()

  if (storeError) throw storeError

  // Log de actividad
  await logActivity('create', 'store', store.id, { store_name: store.name })

  revalidatePath('/super-admin/stores')
  return store
}

export async function updateStoreStatus(storeId: string, status: 'active' | 'inactive' | 'closed') {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stores')
    .update({ status })
    .eq('id', storeId)
    .select()
    .single()

  if (error) throw error

  await logActivity('update_status', 'store', storeId, { new_status: status })

  revalidatePath('/super-admin/stores')
  return data
}

export async function deleteStore(storeId: string) {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', storeId)

  if (error) throw error

  await logActivity('delete', 'store', storeId)

  revalidatePath('/super-admin/stores')
}

// ============= USERS =============

export async function getAllUsers(): Promise<UserProfile[]> {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, role: 'super_admin' | 'store_admin' | 'user') {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error

  await logActivity('update_role', 'user', userId, { new_role: role })

  revalidatePath('/super-admin/users')
  return data
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ is_active: isActive })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error

  await logActivity(isActive ? 'enable_user' : 'disable_user', 'user', userId, { is_active: isActive })

  revalidatePath('/super-admin/users')
  return data
}

// ============= ANALYTICS =============

export async function getGlobalStats() {
  await requireSuperAdmin()
  const supabase = await createClient()

  const [storesResult, usersResult, quotationsResult, productsResult] = await Promise.all([
    supabase.from('stores').select('id, status, total_sales, total_orders'),
    supabase.from('user_profiles').select('id, role'),
    supabase.from('quotations').select('id, total, status, created_at'),
    supabase.from('products').select('id, stock, status')
  ])

  const stores = storesResult.data || []
  const users = usersResult.data || []
  const quotations = quotationsResult.data || []
  const products = productsResult.data || []

  console.log('📊 [getGlobalStats] Stores:', stores.length)
  console.log('📊 [getGlobalStats] Users:', users.length)
  console.log('📊 [getGlobalStats] Quotations:', quotations.length)
  console.log('📊 [getGlobalStats] Products:', products.length)

  // Calcular estadísticas - solo contar cotizaciones convertidas como ventas
  const convertedQuotations = quotations.filter(q => q.status === 'converted')
  const totalRevenue = convertedQuotations.reduce((sum, q) => sum + (q.total || 0), 0)
  const activeStores = stores.filter(s => s.status === 'active').length
  const totalOrders = quotations.length
  const totalProducts = products.length

  console.log('💰 [getGlobalStats] Total Revenue:', totalRevenue)
  console.log('📦 [getGlobalStats] Total Orders:', totalOrders)

  // Ventas por mes (últimos 6 meses) - solo cotizaciones convertidas
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const recentQuotations = convertedQuotations.filter(q => new Date(q.created_at) >= sixMonthsAgo)
  const salesByMonth = recentQuotations.reduce((acc, quotation) => {
    const month = new Date(quotation.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })
    acc[month] = (acc[month] || 0) + quotation.total
    return acc
  }, {} as Record<string, number>)

  // Top tiendas por ventas
  const topStores = stores
    .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
    .slice(0, 5)

  return {
    totalRevenue,
    activeStores,
    totalStores: stores.length,
    totalOrders,
    totalProducts,
    totalUsers: users.length,
    salesByMonth,
    topStores,
    usersByRole: {
      super_admin: users.filter(u => u.role === 'super_admin').length,
      store_admin: users.filter(u => u.role === 'store_admin').length,
      user: users.filter(u => u.role === 'user').length
    }
  }
}

export async function getActivityLogs(limit = 50): Promise<ActivityLog[]> {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ============= UTILITIES =============

async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('activity_logs').insert({
    user_id: user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details
  })
}

// ============= EXCEL IMPORT =============

export async function importProductsFromExcel(storeId: string, products: any[]) {
  await requireSuperAdmin()
  const supabase = await createClient()

  const productsToInsert = products.map(p => ({
    store_id: storeId,
    name: p.name,
    description: p.description || '',
    price: parseFloat(p.price),
    category: p.category,
    stock: parseInt(p.stock) || 0,
    status: parseInt(p.stock) > 10 ? 'available' : parseInt(p.stock) > 0 ? 'low_stock' : 'out_of_stock',
    images: p.images ? [p.images] : []
  }))

  const { data, error } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select()

  if (error) throw error

  await logActivity('import_products', 'store', storeId, { count: products.length })

  revalidatePath(`/super-admin/stores/${storeId}`)
  return data
}
