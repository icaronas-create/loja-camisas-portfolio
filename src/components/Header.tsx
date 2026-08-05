'use client'

import Link from 'next/link'
import { useCarrinho } from '@/lib/cart-context'

export default function Header() {
  const { itens } = useCarrinho()

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          Camisas do Time
        </Link>

        <Link href="/carrinho" className="relative flex items-center gap-1">
          <span className="text-sm">Carrinho</span>
          {itens.length > 0 && (
            <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itens.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}