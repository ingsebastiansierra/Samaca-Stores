'use client'

'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
        // Admin routes: no Navbar, no Footer, no WhatsAppButton, no main wrapper
        return <>{children}</>
    }

    // Client routes: with Navbar, Footer, WhatsAppButton
    return (
        <>
            <Navbar />
            <main className="min-h-screen relative z-10">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}
