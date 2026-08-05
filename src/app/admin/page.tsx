import { createClient } from '@/lib/supabase-server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">Painel administrativo</h1>
      <p className="text-gray-600 mt-2">Logado como: {user?.email}</p>
    </main>
  )
}