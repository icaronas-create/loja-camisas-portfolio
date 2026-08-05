import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false })

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Painel administrativo</h1>
        <form action={logout}>
          <button className="text-sm text-gray-600 underline">Sair</button>
        </form>
      </div>
      <p className="text-gray-600 text-sm mb-6">Logado como: {user?.email}</p>

      <Link
        href="/admin/produtos/novo"
        className="inline-block bg-black text-white px-4 py-2 rounded-lg font-semibold mb-6"
      >
        + Novo produto
      </Link>

      <div className="border border-gray-200 rounded-lg divide-y">
        {produtos?.map((produto) => (
          <div key={produto.id} className="flex items-center gap-4 p-4">
            <img
              src={produto.foto_url}
              alt={produto.nome}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{produto.nome}</p>
              <p className="text-xs text-gray-500">
                Tamanho {produto.tamanho} · R$ {produto.preco.toFixed(2).replace('.', ',')} ·{' '}
                <span className={produto.status === 'disponivel' ? 'text-green-600' : 'text-gray-400'}>
                  {produto.status}
                </span>
              </p>
            </div>
            <Link
              href={`/admin/produtos/${produto.id}`}
              className="text-sm underline text-gray-600"
            >
              Editar
            </Link>
          </div>
        ))}

        {produtos?.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </main>
  )
}