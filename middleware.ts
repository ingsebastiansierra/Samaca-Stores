import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas de super admin
  if (request.nextUrl.pathname.startsWith('/super-admin')) {
    console.log('🔒 [Middleware] Protegiendo ruta super-admin:', request.nextUrl.pathname)
    
    if (!user) {
      console.log('❌ [Middleware] No hay usuario, redirigiendo a login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    console.log('✅ [Middleware] Usuario autenticado:', user.email)
    console.log('🔍 [Middleware] Consultando rol...')

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    console.log('📊 [Middleware] Perfil:', profile)
    console.log('❌ [Middleware] Error:', error)

    if (profile?.role !== 'super_admin') {
      console.log('❌ [Middleware] No es super_admin, redirigiendo a /')
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('✅ [Middleware] Es super_admin, permitiendo acceso')
    return response
  }

  // Si el usuario está autenticado y va a la raíz, redirigir según su rol
  if (user && request.nextUrl.pathname === '/') {
    console.log('🏠 [Middleware] Usuario en raíz:', user.email)
    console.log('🔍 [Middleware] User ID:', user.id)
    console.log('🔍 [Middleware] Consultando user_profiles...')
    
    // Primero verificar si es super admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('📊 [Middleware] Perfil obtenido:', profile)
    console.log('❌ [Middleware] Error (si hay):', profileError)

    if (profile?.role === 'super_admin') {
      console.log('🚀 [Middleware] Super admin detectado, redirigiendo a /super-admin/dashboard')
      return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
    } else {
      console.log('⚠️ [Middleware] NO es super_admin. Rol:', profile?.role || 'null')
    }

    // Si no es super admin, verificar si tiene tienda
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (store) {
      console.log('🏪 [Middleware] Store admin detectado, redirigiendo a /admin/dashboard')
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    console.log('👤 [Middleware] Usuario normal, permitiendo acceso a /')
  }

  // Proteger rutas de admin de tienda
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    // Super admins tienen acceso a todo
    if (profile?.role === 'super_admin') {
      return response
    }

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!store) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/super-admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
