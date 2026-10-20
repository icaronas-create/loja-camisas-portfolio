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
    <>
      <section className="relative min-h-[480px] lg:min-h-[540px] flex items-center bg-[#0a0b0b] bg-noise overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0b] via-[#0a0b0b]/85 to-[#141615]" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] text-[#f0f0ec] leading-[1.06] tracking-tight uppercase mb-5">
              Camisas de time,<br />
              História de<br />
              Verdade
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Peças de brechó selecionadas uma a uma — cada camisa é única e só existe um exemplar.
            </p>
            <a href="#catalogo" className="inline-block bg-[#1b3024] hover:bg-[#254231] text-neutral-200 text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded border border-[#3e5c4a] transition shadow-lg">
              Ver catálogo
            </a>
          </div>
        </div>
      </section>

      <div className="ticket-divider w-full flex items-center justify-around text-[9px] font-mono-tech text-neutral-900 uppercase tracking-widest overflow-hidden select-none">
        <span>★ Pratas da Casa</span>
        <span>Authentic Vintage Club</span>
        <span>★ Peça única</span>
        <span>História de verdade</span>
      </div>

      <main id="catalogo" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 bg-[#0a0b0b]">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
          <div className="text-neutral-400 text-xl">★</div>
          <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase text-[#e5e5e0] text-center">
            Últimos lançamentos
          </h2>
          <div className="w-5" />
        </div>

        <form action="/" method="GET" className="mb-6">
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input
            type="text"
            name="busca"
            defaultValue={busca}
            placeholder="Buscar por time..."
            className="w-full max-w-md px-4 py-2 bg-[#161717] border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500"
          />
        </form>

        <div className="flex gap-2 mb-8 flex-wrap">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm border ${
              !categoria ? 'bg-white text-black border-white' : 'border-neutral-700 text-neutral-300'
            }`}
          >
            Todas
          </Link>
          {categorias?.map((cat) => (
            <Link
              key={cat.id}
              href={`/?categoria=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm border ${
                categoria === cat.slug ? 'bg-white text-black border-white' : 'border-neutral-700 text-neutral-300'
              }`}
            >
              {cat.nome}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-neutral-800 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 bg-[#121313]/60">
          {produtos?.map((produto) => (
            <Link
              key={produto.id}
              href={`/produto/${produto.id}`}
              className="p-4 flex flex-col justify-between group hover:bg-neutral-900/40 transition"
            >
              <div className="relative">
                {produto.raro && (
                  <span className="badge-vintage-rust absolute -top-2 -left-1 z-10 text-[10px] font-condensed font-bold uppercase tracking-wider px-2.5 py-0.5">
                    Raridade
                  </span>
                )}
                <div className="polaroid-frame aspect-[4/5] w-full overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={produto.foto_url}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
              <div className="mt-3.5 pt-2">
                <p className="font-mono-tech text-[11px] tracking-wider uppercase text-[#c8aa6e] mb-1">
                  Tam: {produto.tamanho} / Estado: {produto.estado_conservacao}/10
                </p>
                <div className="flex items-baseline justify-between gap-2 border-t border-neutral-800/80 pt-2">
                  <h3 className="font-condensed text-sm tracking-wide uppercase text-neutral-200 truncate">
                    {produto.nome}
                  </h3>
                  <span className="font-condensed text-sm font-bold text-white whitespace-nowrap">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {produtos?.length === 0 && (
            <p className="col-span-full text-neutral-500 p-8">Nenhuma camisa nessa categoria ainda.</p>
          )}
        </div>
      </main>
    </>
  )
}