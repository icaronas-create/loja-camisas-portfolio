'use client'

import { useCarrinho } from '@/lib/cart-context'
import Link from 'next/link'

export default function CarrinhoPage() {
  const { itens, remover, total } = useCarrinho()

  if (itens.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
        <Link href="/" className="inline-block mt-4 text-black underline">
          Ver camisas disponíveis
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Seu carrinho</h1>

      <div className="border border-gray-200 rounded-lg divide-y">
        {itens.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <img
              src={item.foto_url}
              alt={item.nome}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm uppercase">{item.nome}</p>
              <p className="text-xs text-gray-500">Tamanho {item.tamanho}</p>
              <p className="font-bold text-sm mt-1">
                R$ {item.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <button
              onClick={() => remover(item.id)}
              className="text-sm text-red-600 underline"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 text-lg font-bold">
        <span>Total</span>
        <span>R$ {total.toFixed(2).replace('.', ',')}</span>
      </div>

      <Link
        href="/checkout"
        className="block text-center bg-black text-white py-3 rounded-lg font-semibold mt-6"
      >
        Fechar pedido
      </Link>
    </main>
  )
}