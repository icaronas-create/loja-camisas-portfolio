import { createAdminClient } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { itens, comprador } = body

  if (!itens || itens.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const idsProdutos = itens.map((i: { id: string }) => i.id)
  const { data: produtosAtuais } = await supabase
    .from('produtos')
    .select('id, status, preco')
    .in('id', idsProdutos)

  const indisponivel = produtosAtuais?.find((p) => p.status !== 'disponivel')
  if (indisponivel) {
    return NextResponse.json(
      { error: 'Um dos itens do carrinho já foi vendido. Atualize a página.' },
      { status: 409 }
    )
  }

  const pedidosCriados = []
  for (const item of itens) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        produto_id: item.id,
        comprador_nome: comprador.nome,
        comprador_email: comprador.email,
        comprador_telefone: comprador.telefone,
        endereco_entrega: {
          cep: comprador.cep,
          rua: comprador.rua,
          numero: comprador.numero,
          complemento: comprador.complemento,
          cidade: comprador.cidade,
          estado: comprador.estado,
        },
        status_pagamento: 'pendente',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    pedidosCriados.push(data)
  }

  return NextResponse.json({ pedidos: pedidosCriados })
}