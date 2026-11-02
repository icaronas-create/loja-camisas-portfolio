'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCarrinho } from '@/lib/cart-context'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const notices = [
  "Primeira compra: cupom PRATA10 com 10% off",
  "Pix com 5% de desconto",
  "Até 6x sem juros",
  "Frete grátis acima de R$ 399"
]

const navLinks = [
  ["Loja", "/#loja"],
  ["Clubes", "/#categorias"],
  ["Seleções", "/#categorias"],
  ["Como verificamos", "/#verificacao"],
]

export default function Header() {
  const { itens } = useCarrinho()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [user, setUser] = useState<any>(null)

  // Verifica se o usuário está logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchOpen(false)
    if (query.trim()) {
      router.push(`/?busca=${encodeURIComponent(query.trim())}#categorias`)
    } else {
      router.push('/#categorias')
    }
  }

  const count = itens.reduce((sum: number, item: any) => {
    const qtd = item.qty ?? item.quantidade ?? 1
    return sum + qtd
  }, 0)

  return (
    <>
      <div className="overflow-hidden bg-primary py-2 text-xs text-primary-foreground select-none">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...notices, ...notices, ...notices, ...notices].map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur text-foreground w-full">
        <div className="relative flex h-20 w-full items-center justify-between px-6 md:px-12">
          
          <div className="flex items-center flex-1">
            <button aria-label="Abrir menu" className="md:hidden mr-4" onClick={() => setMenuOpen(true)}>
              <Menu className="size-6" />
            </button>
            <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-widest md:flex">
              {navLinks.map(([t, h]) => (
                <Link key={t} href={h} className="hover:text-accent transition-colors">
                  {t}
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
            <Link href="/" aria-label="Pratas da Casa">
              <img 
                src="/logo-pratas.png" 
                alt="Pratas da Casa" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-6 flex-1">
            <button aria-label="Buscar" onClick={() => setSearchOpen((s) => !s)} className="hover:text-accent transition">
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            
            {/* Ícone de Usuário Dinâmico */}
            <Link 
              href={user ? "/perfil" : "/login"} 
              aria-label="Minha conta" 
              className="hover:text-accent transition"
            >
              <User className="hidden size-5 sm:block" />
            </Link>

            <Link href="/carrinho" aria-label="Abrir carrinho" className="relative hover:text-accent transition">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border px-6 py-4 md:px-12 bg-background">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3 border-b border-foreground pb-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar time, seleção ou ano e aperte Enter…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden text-foreground">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute inset-y-0 left-0 flex w-72 flex-col bg-background p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-logo text-2xl uppercase">Pratas da Casa</span>
              <button aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
            {navLinks.map(([t, h]) => (
              <Link
                key={t}
                href={h}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-4 text-sm font-semibold uppercase tracking-wider"
              >
                {t}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}