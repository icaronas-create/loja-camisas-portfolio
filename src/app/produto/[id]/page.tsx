import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BotaoCarrinho from './BotaoCarrinho'

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: produto, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !produto) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid sm:grid-cols-2 gap-8">
        <img
          src={produto.foto_url}
          alt={produto.nome}
          className="w-full rounded-lg object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold uppercase">{produto.nome}</h1>
          <p className="text-gray-500 mt-1">
            {produto.time} · {produto.temporada}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tamanho {produto.tamanho}</p>

          <p className="text-3xl font-bold mt-6">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </p>

          {produto.descricao && (
            <p className="text-sm text-gray-700 mt-4">{produto.descricao}</p>
          )}

          <BotaoCarrinho produto={produto} />
        </div>
      </div>
    </main>
  )
}