import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  BadgeCheck,
  Sparkles,
  ScanSearch,
  PackageCheck,
} from 'lucide-react'
import Newsletter from '@/components/Newsletter'

type Categoria = {
  id: string
  nome: string
  slug: string
}

type Produto = {
  id: string
  nome: string
  preco: number
  tamanho: string
  estado_conservacao: number
  foto_url: string
  raro?: boolean
  categoria_id?: string
}

const steps = [
  {
    Icon: ScanSearch,
    title: 'Autenticação',
    desc: 'Conferimos etiquetas, costuras, escudo e código do fabricante peça por peça.',
  },
  {
    Icon: Sparkles,
    title: 'Higienização',
    desc: 'Lavagem especializada e tratamento que preserva tecido, números e patrocínios.',
  },
  {
    Icon: PackageCheck,
    title: 'Fotos reais e envio',
    desc: 'Fotografamos a própria peça, apontamos detalhes de uso e enviamos com rastreio.',
  },
]

const trustBadges = [
  { Icon: BadgeCheck, title: 'Originais verificadas', desc: 'Cada peça é autenticada' },
  { Icon: ShieldCheck, title: 'Compra segura', desc: 'Pix, cartão e boleto' },
  { Icon: Truck, title: 'Envio para todo Brasil', desc: 'Com código de rastreio' },
  { Icon: RefreshCw, title: 'Troca em 7 dias', desc: 'Sem burocracia' },
]

// Mapeamento dos links do rodapé com URLs funcionais ou âncoras
const footerSections = [
  {
    title: 'Ajuda',
    links: [
      { label: 'Trocas e devoluções', href: '/#verificacao' },
      { label: 'Prazos de entrega', href: '/#verificacao' },
      { label: 'Guia de tamanhos', href: '/#categorias' },
      { label: 'Fale conosco', href: 'https://wa.me/' }, // Pode colocar o link do WhatsApp comercial aqui
    ],
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Sobre nós', href: '/#loja' },
      { label: 'Como verificamos', href: '/#verificacao' },
      { label: 'Venda sua camisa', href: 'https://wa.me/' },
      { label: 'Política de privacidade', href: '#' },
    ],
  },
]

const formatBRL = (valor: number) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>
}) {
  const { categoria, busca } = await searchParams

  const { data: categoriasData } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')

  const categorias = (categoriasData || []) as Categoria[]

  let query = supabase
    .from('produtos')
    .select('*')
    .eq('status', 'disponivel')
    .order('criado_em', { ascending: false })

  if (categoria) {
    const categoriaAtual = categorias.find((c: Categoria) => c.slug === categoria)
    if (categoriaAtual) {
      query = query.eq('categoria_id', categoriaAtual.id)
    }
  }

  if (busca) {
    query = query.textSearch('nome', busca, {
      type: 'websearch',
      config: 'portuguese',
    })
  }

  const { data: produtosData, error } = await query

  if (error) {
    return <p className="p-8 text-red-600">Erro: {error.message}</p>
  }

  const listaProdutos = (produtosData || []) as Produto[]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Banner Hero */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Camisas retrô de futebol penduradas na parede"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.3em]">Coleção 04 · Garimpo 2026</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase leading-[0.95] md:text-7xl">
            Toda camisa tem uma história.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#loja"
              className="bg-primary-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-primary transition hover:opacity-90"
            >
              Ver peças
            </a>
            <a
              href="#verificacao"
              className="border border-primary-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest transition hover:bg-primary-foreground hover:text-primary"
            >
              Como verificamos
            </a>
          </div>
        </div>
      </section>

      {/* Selos de Confiança */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4">
          {trustBadges.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="size-6 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Carrossel de Novidades */}
      {listaProdutos.length > 0 && (
        <section id="loja" className="py-20">
          <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Acabou de chegar
              </p>
              <h2 className="mt-2 text-4xl font-black uppercase">Novidades do garimpo</h2>
            </div>
            <a
              href="#categorias"
              className="hidden border-b border-foreground pb-1 text-xs font-semibold uppercase tracking-widest md:block"
            >
              Ver tudo
            </a>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee pause-hover gap-6 px-3">
              {[...listaProdutos, ...listaProdutos].map((produto: Produto, i: number) => (
                <Link
                  key={`${produto.id}-${i}`}
                  href={`/produto/${produto.id}`}
                  className="group w-64 shrink-0 md:w-72 block"
                >
                  <div className="relative overflow-hidden bg-card">
                    <img
                      src={produto.foto_url}
                      alt={produto.nome}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-widest">
                      {produto.raro ? 'Raridade' : 'Peça única'}
                    </span>
                    <span className="absolute inset-x-3 bottom-3 bg-primary py-3 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground transition md:translate-y-16 md:group-hover:translate-y-0">
                      Ver detalhes
                    </span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Tam. {produto.tamanho} · Nota {produto.estado_conservacao}/10
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatBRL(produto.preco)}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ou 6x de {formatBRL(produto.preco / 6)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo e Categorias */}
      <section id="categorias" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 pt-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Explore</p>
            <h2 className="mt-2 text-4xl font-black uppercase">Compre por categoria</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/#categorias"
              className={`border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                !categoria
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-foreground'
              }`}
            >
              Todas
            </Link>
            {categorias.map((cat: Categoria) => (
              <Link
                key={cat.id}
                href={`/?categoria=${cat.slug}#categorias`}
                className={`border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                  categoria === cat.slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {cat.nome}
              </Link>
            ))}
          </div>
        </div>

        {/* Busca por texto */}
        <form action="/" method="GET" className="mb-8 flex max-w-md border-b border-foreground pb-2">
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input
            type="text"
            name="busca"
            defaultValue={busca}
            placeholder="Buscar por time ou seleção..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="text-xs font-semibold uppercase tracking-widest hover:text-accent"
          >
            Buscar
          </button>
        </form>

        {/* Grade de Produtos */}
        {listaProdutos.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {listaProdutos.map((produto: Produto) => (
              <Link
                key={produto.id}
                href={`/produto/${produto.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden bg-card">
                  <img
                    src={produto.foto_url}
                    alt={produto.nome}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-widest">
                    {produto.raro ? 'Raridade' : 'Peça única'}
                  </span>
                  <span className="absolute inset-x-3 bottom-3 bg-primary py-3 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground transition md:translate-y-16 md:group-hover:translate-y-0">
                    Ver camisa
                  </span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{produto.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Tam. {produto.tamanho} · Estado {produto.estado_conservacao}/10
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatBRL(produto.preco)}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  ou 6x de {formatBRL(produto.preco / 6)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma camisa encontrada {busca ? `para "${busca}"` : 'nessa categoria'}.
          </p>
        )}
      </section>

      {/* Como Verificamos */}
      <section id="verificacao" className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Confiança em cada detalhe
          </p>
          <h2 className="mt-2 text-4xl font-black uppercase">Como verificamos cada peça</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map(({ Icon, title, desc }, index) => (
              <div key={title} className="border-t border-foreground pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-logo text-5xl text-accent">0{index + 1}</span>
                  <Icon className="size-7" />
                </div>
                <h3 className="mt-4 text-xl font-black uppercase">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Interativa */}
      <Newsletter />

      {/* Rodapé Funcional */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-logo text-3xl uppercase tracking-wide">Pratas da Casa</p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Camisas de futebol originais garimpadas, verificadas e prontas para uma nova história.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold uppercase tracking-widest">{section.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">Redes sociais</p>
            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <a 
                href="https://www.instagram.com/pratasdacasa.club/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest">Pagamento</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Pix', 'Visa', 'Master', 'Elo', 'Boleto'].map((m) => (
                <span key={m} className="border border-border px-2 py-1 text-[10px] font-semibold uppercase select-none">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-muted-foreground">
            © 2026 Pratas da Casa · Compra 100% segura
          </p>
        </div>
      </footer>
    </div>
  )
}