import { createClient } from '@/lib/supabase/client'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

// Registrar nuevo usuario
export async function signUp(data: SignUpData) {
  const supabase = createClient()
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
      },
    },
  })

  if (error) throw error
  return authData
}

// Iniciar sesión
export async function signIn(data: SignInData) {
  const supabase = createClient()
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) throw error
  return authData
}

// Obtener rol del usuario desde user_profiles
export async function getUserRole(userId: string): Promise<string> {
  const supabase = createClient()
  
  console.log('🔍 [getUserRole] Buscando rol para usuario:', userId)
  
  try {
    // Primero intentar obtener el perfil
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('❌ [getUserRole] Error al buscar perfil:', profileError)
      throw profileError
    }

    if (profile && profile.role) {
      console.log('✅ [getUserRole] Rol encontrado en user_profiles:', profile.role)
      return profile.role
    }

    console.log('⚠️ [getUserRole] No se encontró perfil, verificando si tiene tienda...')
    
    // Si no existe el perfil, verificar si tiene tienda (es store_admin)
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (storeError) {
      console.error('❌ [getUserRole] Error al buscar tienda:', storeError)
    }

    if (store) {
      console.log('✅ [getUserRole] Tiene tienda, rol: store_admin')
      return 'store_admin'
    }

    console.log('ℹ️ [getUserRole] No tiene perfil ni tienda, rol: user')
    return 'user'
    
  } catch (error) {
    console.error('❌ [getUserRole] Error general:', error)
    return 'user'
  }
}

// Cerrar sesión
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Recuperar contraseña
export async function resetPassword(data: ResetPasswordData) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
}

// Actualizar contraseña
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

// Obtener usuario actual
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  return user
}

// Obtener sesión actual
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) throw error
  return session
}

// Verificar si el usuario tiene una tienda
export async function getUserStore(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Verificar si el usuario es staff de alguna tienda
export async function getUserStoreStaff(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('store_staff')
    .select(`
      *,
      stores (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error) throw error
  return data
}

// Crear tienda para un usuario
export async function createStore(userId: string, storeData: {
  name: string
  slug: string
  description?: string
  owner_name: string
  owner_email: string
  owner_phone: string
  city?: string
  address?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stores')
    .insert({
      ...storeData,
      user_id: userId,
      status: 'pending', // Requiere aprobación
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Obtener rol del usuario (para el UserMenu) - versión síncrona
export function getUserRoleSync(user: any): string {
  // Por ahora retornamos 'customer' por defecto
  // Esto se puede expandir para verificar si tiene tienda
  return user?.user_metadata?.role || 'customer'
}

// Verificar si el usuario tiene tiendas
export async function checkUserHasStore(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (error) return false
  return (data && data.length > 0)
}
