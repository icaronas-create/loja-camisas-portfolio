'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCarrinho } from '@/lib/cart-context'

export default function PedidoConfirmadoPage() {
  const { limpar } = useCarrinho()

  useEffect(() => {
    limpar()
  }, [])

  return (
    <main className="max-w-lg mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Pedido recebido!</h1>
      <p className="text-gray-600">
        Assim que o pagamento for confirmado, você vai receber os detalhes por e-mail.
      </p>
      <Link href="/" className="inline-block mt-6 text-black underline">
        Voltar pro catálogo
      </Link>
    </main>
  )
}