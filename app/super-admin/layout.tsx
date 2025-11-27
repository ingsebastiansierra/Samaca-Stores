import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar'
import { SuperAdminHeader } from '@/components/super-admin/SuperAdminHeader'
import { Toaster } from 'react-hot-toast'

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isSuperAdminUser = await isSuperAdmin()

    if (!isSuperAdminUser) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SuperAdminSidebar />
            <div className="lg:pl-64">
                <SuperAdminHeader />
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
