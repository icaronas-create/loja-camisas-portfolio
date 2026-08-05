'use client'

import { useCarrinho } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const { itens, total } = useCarrinho()
  const router = useRouter()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  if (itens.length === 0) {
    router.push('/carrinho')
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const formData = new FormData(e.currentTarget)
    const comprador = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      cep: formData.get('cep') as string,
      rua: formData.get('rua') as string,
      numero: formData.get('numero') as string,
      complemento: formData.get('complemento') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
    }

    const resposta = await fetch('/api/criar-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens, comprador }),
    })

    const resultado = await resposta.json()
    setCarregando(false)

    if (!resposta.ok) {
      setErro(resultado.error || 'Erro ao criar pedido.')
      return
    }

    alert(`Pedido(s) criado(s)! IDs: ${resultado.pedidos.map((p: any) => p.id).join(', ')}`)
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-2">Finalizar pedido</h1>
      <p className="text-gray-500 text-sm mb-6">
        {itens.length} {itens.length === 1 ? 'item' : 'itens'} · Total: R${' '}
        {total.toFixed(2).replace('.', ',')}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Nome completo</label>
          <input
            name="nome"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Telefone (WhatsApp)</label>
          <input
            name="telefone"
            required
            placeholder="(21) 99999-9999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">CEP</label>
            <input
              name="cep"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Número</label>
            <input
              name="numero"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Rua</label>
          <input
            name="rua"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Complemento <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            name="complemento"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Cidade</label>
            <input
              name="cidade"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Estado</label>
            <input
              name="estado"
              required
              maxLength={2}
              placeholder="RJ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="bg-black text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 mt-2"
        >
          {carregando ? 'Processando...' : 'Ir para pagamento'}
        </button>
      </form>
    </main>
  )
}