'use client'

import { useCarrinho } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

type Props = {
  produto: {
    id: string
    nome: string
    preco: number
    foto_url: string
    tamanho: string
    status: string
  }
}

export default function BotaoCarrinho({ produto }: Props) {
  const { itens, adicionar } = useCarrinho()
  const router = useRouter()

  const jaEstaNoCarrinho = itens.some((i) => i.id === produto.id)

  function handleClick() {
    if (jaEstaNoCarrinho) {
      router.push('/carrinho')
      return
    }

    adicionar({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto_url: produto.foto_url,
      tamanho: produto.tamanho,
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={produto.status !== 'disponivel'}
      className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
    >
      {produto.status !== 'disponivel'
        ? 'Esgotado'
        : jaEstaNoCarrinho
        ? 'Ver no carrinho'
        : 'Adicionar ao carrinho'}
    </button>
  )
}