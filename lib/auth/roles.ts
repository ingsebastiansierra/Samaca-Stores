'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/lib/types/database.types'

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('❌ [getUserProfile] No hay usuario autenticado')
    return null
  }

  console.log('✅ [getUserProfile] Usuario autenticado:', user.email)

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('❌ [getUserProfile] Error al obtener perfil:', error)
    return null
  }

  console.log('✅ [getUserProfile] Perfil obtenido, rol:', profile?.role)
  return profile
}

export async function isSuperAdmin(): Promise<boolean> {
  console.log('🔍 [isSuperAdmin] Verificando si es super admin...')
  const profile = await getUserProfile()
  const result = profile?.role === 'super_admin'
  console.log('✅ [isSuperAdmin] Resultado:', result)
  return result
}

export async function isStoreAdmin(): Promise<boolean> {
  const profile = await getUserProfile()
  return profile?.role === 'store_admin' || profile?.role === 'super_admin'
}

export async function requireSuperAdmin() {
  const isSuperAdminUser = await isSuperAdmin()
  if (!isSuperAdminUser) {
    throw new Error('Acceso denegado: Se requieren permisos de super administrador')
  }
}

export async function requireStoreAdmin() {
  const isStoreAdminUser = await isStoreAdmin()
  if (!isStoreAdminUser) {
    throw new Error('Acceso denegado: Se requieren permisos de administrador')
  }
}
