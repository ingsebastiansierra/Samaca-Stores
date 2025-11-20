'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const categoryData = {
    store_id: formData.get('store_id') as string,
    name: formData.get('name') as string,
    slug: (formData.get('name') as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    description: formData.get('description') as string || null,
    is_active: formData.get('is_active') === 'true',
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/admin/categories')
  return data
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) throw error

  revalidatePath('/admin/categories')
  return { success: true }
}
