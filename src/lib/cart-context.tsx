'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ItemCarrinho = {
  id: string
  nome: string
  preco: number
  foto_url: string
  tamanho: string
}

type CarrinhoContextType = {
  itens: ItemCarrinho[]
  adicionar: (item: ItemCarrinho) => void
  remover: (id: string) => void
  limpar: () => void
  total: number
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [carregado, setCarregado] = useState(false)

  // Carrega o carrinho salvo do navegador ao abrir o site
  useEffect(() => {
    const salvo = localStorage.getItem('carrinho')
    if (salvo) {
      setItens(JSON.parse(salvo))
    }
    setCarregado(true)
  }, [])

  // Salva no navegador toda vez que o carrinho muda
  useEffect(() => {
    if (carregado) {
      localStorage.setItem('carrinho', JSON.stringify(itens))
    }
  }, [itens, carregado])

  function adicionar(item: ItemCarrinho) {
    setItens((prev) => {
      // Como cada camisa é peça única, não faz sentido "quantidade 2" do mesmo produto
      if (prev.some((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  function remover(id: string) {
    setItens((prev) => prev.filter((i) => i.id !== id))
  }

  function limpar() {
    setItens([])
  }

  const total = itens.reduce((soma, item) => soma + item.preco, 0)

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, limpar, total }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (!context) {
    throw new Error('useCarrinho precisa estar dentro de um CarrinhoProvider')
  }
  return context
}