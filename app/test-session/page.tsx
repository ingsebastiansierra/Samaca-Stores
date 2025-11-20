import { createClient } from '@/lib/supabase/server'

export default async function TestSessionPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Sesión</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border">
          <h2 className="font-bold mb-2">Usuario:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-4 rounded border">
          <h2 className="font-bold mb-2">Sesión:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-4 rounded border">
          <h2 className="font-bold mb-2">Error:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
