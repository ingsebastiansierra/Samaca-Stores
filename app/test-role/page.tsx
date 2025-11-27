'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole } from '@/lib/auth/auth-helpers'

export default function TestRolePage() {
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState<string>('')
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        async function checkAuth() {
            try {
                const supabase = createClient()

                // 1. Obtener usuario actual
                const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

                if (userError) throw userError

                if (!currentUser) {
                    setError('No hay usuario autenticado')
                    setLoading(false)
                    return
                }

                setUser(currentUser)
                console.log('Usuario:', currentUser)

                // 2. Obtener perfil
                const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .single()

                if (profileError) {
                    console.error('Error al obtener perfil:', profileError)
                    setError(`Error al obtener perfil: ${profileError.message}`)
                } else {
                    setProfile(profileData)
                    console.log('Perfil:', profileData)
                }

                // 3. Obtener rol usando la función
                const userRole = await getUserRole(currentUser.id)
                setRole(userRole)
                console.log('Rol:', userRole)

            } catch (err: any) {
                console.error('Error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Test de Rol de Usuario</h1>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 font-semibold">❌ Error:</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!user && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 font-semibold">⚠️ No hay usuario autenticado</p>
                        <p className="text-yellow-700 mt-2">
                            <a href="/auth/login" className="underline">Ir a login</a>
                        </p>
                    </div>
                )}

                {user && (
                    <>
                        {/* Usuario */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">👤 Usuario Autenticado</h2>
                            <div className="space-y-2">
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Creado:</strong> {new Date(user.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Perfil */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">📋 Perfil en user_profiles</h2>
                            {profile ? (
                                <div className="space-y-2">
                                    <p><strong>ID:</strong> {profile.id}</p>
                                    <p><strong>User ID:</strong> {profile.user_id}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                    <p><strong>Nombre:</strong> {profile.full_name}</p>
                                    <p className="text-2xl">
                                        <strong>Rol:</strong>{' '}
                                        <span className={`px-3 py-1 rounded-full font-bold ${profile.role === 'super_admin'
                                                ? 'bg-red-100 text-red-800'
                                                : profile.role === 'store_admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {profile.role}
                                        </span>
                                    </p>
                                    {profile.profession && <p><strong>Profesión:</strong> {profile.profession}</p>}
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded p-4">
                                    <p className="text-red-800">❌ No se encontró el perfil en user_profiles</p>
                                    <p className="text-sm text-red-600 mt-2">
                                        Ejecuta el script: scripts/setup-super-admin-completo.sql
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Rol detectado */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">🎯 Rol Detectado por getUserRole()</h2>
                            <p className="text-3xl font-bold">
                                <span className={`px-4 py-2 rounded-lg ${role === 'super_admin'
                                        ? 'bg-red-100 text-red-800'
                                        : role === 'store_admin'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                    {role}
                                </span>
                            </p>
                        </div>

                        {/* Redirección esperada */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">🚀 Redirección Esperada</h2>
                            {role === 'super_admin' ? (
                                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                                    <p className="text-green-800 font-semibold text-lg">
                                        ✅ Deberías ser redirigido a: /super-admin/dashboard
                                    </p>
                                    <a
                                        href="/super-admin/dashboard"
                                        className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                                    >
                                        Ir al Dashboard de Super Admin
                                    </a>
                                </div>
                            ) : role === 'store_admin' ? (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-800 font-semibold text-lg">
                                        ℹ️ Deberías ser redirigido a: /admin/dashboard
                                    </p>
                                    <a
                                        href="/admin/dashboard"
                                        className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                        Ir al Dashboard de Admin
                                    </a>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-800 font-semibold text-lg">
                                        ℹ️ Deberías ser redirigido a: /
                                    </p>
                                    <a
                                        href="/"
                                        className="inline-block mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
                                    >
                                        Ir al Inicio
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Consola */}
                        <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
                            <p className="mb-2">// Abre la consola del navegador (F12) para ver los logs</p>
                            <p>console.log('Usuario:', user)</p>
                            <p>console.log('Perfil:', profile)</p>
                            <p>console.log('Rol:', role)</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
