import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home({
 searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>
}) {
  const { categoria, busca } = await searchParams

  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')

  let query = supabase
    .from('produtos')
    .select('*')
    .eq('status', 'disponivel')
    .order('criado_em', { ascending: false })

  if (categoria) {
    const categoriaAtual = categorias?.find((c) => c.slug === categoria)
    if (categoriaAtual) {
      query = query.eq('categoria_id', categoriaAtual.id)
    }
  }

  if (busca) {
    query = query.textSearch('nome', busca, { type: 'websearch', config: 'portuguese' })
  }

  const { data: produtos, error } = await query

  if (error) {
    return <p className="p-8 text-red-600">Erro: {error.message}</p>
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Camisas disponíveis</h1>
      
      <form action="/" method="GET" className="mb-6">
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <input
          type="text"
          name="busca"
          defaultValue={busca}
          placeholder="Buscar por time..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </form>
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm border ${
            !categoria ? 'bg-black text-white border-black' : 'border-gray-300'
          }`}
        >
          Todas
        </Link>
        {categorias?.map((cat) => (
          <Link
            key={cat.id}
            href={`/?categoria=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm border ${
              categoria === cat.slug ? 'bg-black text-white border-black' : 'border-gray-300'
            }`}
          >
            {cat.nome}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos?.map((produto) => (
          <Link
            key={produto.id}
            href={`/produto/${produto.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow block"
          >
            <img
              src={produto.foto_url}
              alt={produto.nome}
              className="w-full h-64 object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-semibold uppercase">{produto.nome}</p>
              <p className="text-xs text-gray-500 mt-1">
                Tamanho {produto.tamanho} · {produto.temporada}
              </p>
              <p className="font-bold mt-2">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Link>
        ))}

        {produtos?.length === 0 && (
          <p className="col-span-full text-gray-500">Nenhuma camisa nessa categoria ainda.</p>
        )}
      </div>
    </main>
  )
}