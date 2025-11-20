import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CategoriesTable } from '@/components/admin/categories/CategoriesTable'
import { CategoryForm } from '@/components/admin/categories/CategoryForm'

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) redirect('/auth/register')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .order('name')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Categorías</h1>
        <p className="text-gray-600 mt-1">Organiza tus productos por categorías</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CategoriesTable categories={categories || []} />
        </div>
        <div>
          <CategoryForm storeId={store.id} />
        </div>
      </div>
    </div>
  )
}
