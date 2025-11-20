import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StoreSettingsForm } from '@/components/admin/settings/StoreSettingsForm'
import { PasswordChangeForm } from '@/components/admin/settings/PasswordChangeForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-black">Configuración</h1>
        <p className="text-gray-600 mt-1">Gestiona la configuración de tu tienda</p>
      </div>

      <StoreSettingsForm store={store} />
      <PasswordChangeForm />
    </div>
  )
}
