import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-full lg:max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
