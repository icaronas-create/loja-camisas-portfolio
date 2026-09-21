import { createAdminClient } from '@/lib/supabase-admin'
import { preference } from '@/lib/mercadopago'
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
    .select('id, status, preco, nome')
    .in('id', idsProdutos)

  const indisponivel = produtosAtuais?.find((p) => p.status !== 'disponivel')
  if (indisponivel) {
    return NextResponse.json(
      { error: 'Um dos itens do carrinho já foi vendido. Atualize a página.' },
      { status: 409 }
    )
  }

  // Cria um pedido por produto no banco (status ainda pendente)
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

  // Monta os itens no formato que o Mercado Pago espera
  const itensMercadoPago = produtosAtuais!.map((p) => ({
    id: p.id,
    title: p.nome,
    quantity: 1,
    unit_price: Number(p.preco),
    currency_id: 'BRL',
  }))

  const urlBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const resultado = await preference.create({
      body: {
        items: itensMercadoPago,
        payer: {
          name: comprador.nome,
          email: comprador.email,
        },
        // Referência que o webhook vai usar pra saber quais pedidos
        // do NOSSO banco correspondem a esse pagamento
        external_reference: pedidosCriados.map((p) => p.id).join(','),
        back_urls: {
          success: `${urlBase}/pedido-confirmado`,
          failure: `${urlBase}/checkout`,
          pending: `${urlBase}/pedido-confirmado`,
        },
        auto_return: 'approved',
        notification_url: `${urlBase}/api/webhook-mercadopago`,
      },
    })

    // Salva o ID da preferência em cada pedido, pra rastrear depois
    for (const pedido of pedidosCriados) {
      await supabase
        .from('pedidos')
        .update({ mp_preference_id: resultado.id })
        .eq('id', pedido.id)
    }

    return NextResponse.json({
      pedidos: pedidosCriados,
      checkoutUrl: resultado.init_point,
    })
  } catch (mpError: any) {
    return NextResponse.json(
      { error: 'Erro ao criar pagamento: ' + mpError.message },
      { status: 500 }
    )
  }
}