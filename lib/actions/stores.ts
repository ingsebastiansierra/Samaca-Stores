'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStore(storeId: string, formData: FormData) {
  const supabase = await createClient()

  const storeData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    address: formData.get('address') as string || null,
    city: formData.get('city') as string,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    email: formData.get('email') as string || null,
  }

  const { data, error } = await supabase
    .from('stores')
    .update(storeData)
    .eq('id', storeId)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/admin/settings')
  return data
}
