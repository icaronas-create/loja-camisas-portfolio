"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context"; // ajuste se o seu hook tiver outro nome

export default function Header() {
  const { items } = useCart();

  return (
    <>
      {/* BARRA DE TOPO */}
      <div className="bg-[#080909] text-[#a0a5a1] text-[11px] tracking-widest uppercase py-2 px-4 text-center border-b border-neutral-800/80 font-medium">
        <span>PEÇA ÚNICA, SEM REPOSIÇÃO</span>
        <span className="mx-3 text-neutral-600">•</span>
        <span>ENVIO PARA TODO O BRASIL</span>
        <span className="mx-3 text-neutral-600">•</span>
        <span>PAGAMENTO VIA PIX, CARTÃO OU BOLETO</span>
      </div>

      {/* NAVBAR */}
      <header className="bg-[#0f1010]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-800/80 px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO (Em SVG/Texto estilizado para não quebrar) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full bg-neutral-900 border border-neutral-600 flex items-center justify-center shadow-inner">
              <svg className="w-7 h-7 text-neutral-300 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 6.7V5.3zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34-.78 1.37zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h6.1l.64 1.1-.69 1.49zM14.27 14H9.73l-1.35-4.02L12 7.44l3.63 2.54L14.27 14zm3.79 3.21l-1.14-.1-.79-1.37 1.46-4.34 1.39-.47 1 .73c.01.11.02.22.02.34 0 1.99-.73 3.81-1.94 5.21z"/>
              </svg>
              <span className="absolute -top-1 -right-1 text-xs text-white drop-shadow">★</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-wider text-[#9aa8a1] italic uppercase">
                PRATAS
              </span>
              <span className="font-display text-base tracking-widest text-[#7d8c85] -mt-1 italic uppercase">
                DA CASA
              </span>
            </div>
          </Link>

          {/* LINKS DE NAVEGAÇÃO */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase text-neutral-300">
            <Link href="/" className="hover:text-white transition">Camisas</Link>
            <Link href="/#catalogo" className="hover:text-white transition">Times</Link>
            <Link href="/#catalogo" className="hover:text-white transition">Ofertas</Link>
            <Link href="/#catalogo" className="hover:text-white transition">Sobre</Link>
          </nav>

          {/* BUSCA + CARRINHO */}
          <div className="flex items-center space-x-5 text-neutral-300">
            <a href="#catalogo" aria-label="Pesquisar" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </a>

            <Link href="/carrinho" className="relative flex items-center gap-2 text-neutral-300 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
              </svg>
              {items && items.length > 0 && (
                <span className="bg-white text-black font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}