import { HomeClient } from '@/components/home/HomeClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Revalidar cada 5 minutos
export const revalidate = 300

export default async function HomePage() {
  const supabase = await createClient()

  // Verificar si hay usuario autenticado
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    console.log('✅ [HomePage] Usuario autenticado:', user.email)

    // Verificar si es super admin
    console.log('🔍 [HomePage] Consultando user_profiles para user_id:', user.id)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('📊 [HomePage] Perfil obtenido:', profile)
    console.log('❌ [HomePage] Error (si hay):', profileError)

    if (profile?.role === 'super_admin') {
      console.log('🚀 [HomePage] Super admin detectado, redirigiendo...')
      redirect('/super-admin/dashboard')
    } else {
      console.log('⚠️ [HomePage] NO es super_admin. Rol encontrado:', profile?.role || 'null')
    }

    // Verificar si tiene tienda (es store admin)
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (store) {
      console.log('🏪 [HomePage] Store admin detectado, redirigiendo...')
      redirect('/admin/dashboard')
    }

    console.log('👤 [HomePage] Usuario normal, mostrando home')
  }

  return <HomeClient />
}
