'use client'

import Link from 'next/link'
import { useCarrinho } from '@/lib/cart-context'

export default function Header() {
  const { itens } = useCarrinho()

  return (
    <>
      <div className="bg-[#080909] text-[#a0a5a1] text-[11px] tracking-widest uppercase py-2 px-4 text-center border-b border-neutral-800/80 font-medium">
        <span>Peça única, sem reposição</span>
        <span className="mx-3 text-neutral-600">•</span>
        <span>Envio para todo o Brasil</span>
        <span className="mx-3 text-neutral-600">•</span>
        <span>Pagamento via Pix, cartão ou boleto</span>
      </div>

      <header className="bg-[#0f1010]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-800/80 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Pratas da Casa" className="h-10 w-10 object-contain" />
            <span className="font-display text-sm tracking-wider text-[#e5e5e0]">PRATAS DA CASA</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase text-neutral-300">
            <Link href="/" className="hover:text-white transition">Camisas</Link>
          </nav>

          <Link href="/carrinho" className="relative flex items-center gap-2 text-neutral-300 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            {itens.length > 0 && (
              <span className="bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itens.length}
              </span>
            )}
          </Link>
        </div>
      </header>
    </>
  )
}