import { createAdminClient } from '@/lib/supabase-admin'
import { payment } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // O Mercado Pago manda vários tipos de notificação; só nos importa "payment"
  if (body?.type !== 'payment' || !body?.data?.id) {
    return NextResponse.json({ received: true })
  }

  const paymentId = body.data.id

  try {
    const pagamento = await payment.get({ id: paymentId })

    const externalReference = pagamento.external_reference
    if (!externalReference) {
      return NextResponse.json({ received: true })
    }

    const idsPedidos = externalReference.split(',')
    const supabase = createAdminClient()

    if (pagamento.status === 'approved') {
      for (const pedidoId of idsPedidos) {
        // Idempotente: só atualiza (e só marca o produto como vendido) se esse
        // pedido ainda não tiver sido processado como aprovado antes
        const { data: pedidoAtualizado } = await supabase
          .from('pedidos')
          .update({
            status_pagamento: 'aprovado',
            mp_payment_id: String(paymentId),
            atualizado_em: new Date().toISOString(),
          })
          .eq('id', pedidoId)
          .neq('status_pagamento', 'aprovado')
          .select('produto_id')
          .single()

        if (pedidoAtualizado) {
          // Só marca como vendido se ainda estiver disponível — evita vender
          // a mesma peça duas vezes se duas notificações chegarem quase juntas
          await supabase
            .from('produtos')
            .update({ status: 'vendido' })
            .eq('id', pedidoAtualizado.produto_id)
            .eq('status', 'disponivel')
        }
      }
    } else if (pagamento.status === 'rejected' || pagamento.status === 'cancelled') {
      await supabase
        .from('pedidos')
        .update({
          status_pagamento: 'recusado',
          mp_payment_id: String(paymentId),
          atualizado_em: new Date().toISOString(),
        })
        .in('id', idsPedidos)
    }
    // outros status (pending, in_process etc.) não fazem nada ainda — espera a próxima notificação

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error)
    // Propositalmente NÃO retorna 200 aqui: isso faz o Mercado Pago reenviar
    // a notificação mais tarde, em vez de desistir silenciosamente
    return NextResponse.json({ error: 'Erro ao processar notificação' }, { status: 500 })
  }
}