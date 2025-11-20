'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
  
  if (error) {
    throw new Error('Error al eliminar producto')
  }
  
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(
  productId: string,
  data: {
    name: string
    slug: string
    description: string
    price: number
    stock: number
    category_id: string
    is_active: boolean
    images?: string[]
  }
) {
  const supabase = await createClient()
  
  const updateData: any = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    stock: data.stock,
    category_id: data.category_id,
    is_active: data.is_active,
    updated_at: new Date().toISOString(),
  }

  // Solo actualizar imágenes si se proporcionan
  if (data.images) {
    updateData.images = data.images
  }
  
  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId)
  
  if (error) {
    throw new Error('Error al actualizar producto')
  }
  
  revalidatePath('/admin/products')
  return { success: true }
}
