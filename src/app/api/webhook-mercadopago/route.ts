import { createAdminClient } from '@/lib/supabase-admin'
import { payment } from '@/lib/mercadopago'
import { WebhookSignatureValidator } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const body = await request.json()

  // O Mercado Pago manda vários formatos de notificação pra essa mesma URL
  // (merchant_order, topic_merchant_order_wh etc). Só nos interessa "payment" —
  // ignoramos o resto ANTES de tentar validar assinatura, porque os outros
  // formatos nem têm os mesmos campos.
  if (body?.type !== 'payment' || !body?.data?.id) {
    return NextResponse.json({ received: true })
  }

  const paymentId = body.data.id

  // --- Validação de assinatura: por enquanto só REGISTRA o resultado, não bloqueia nada ainda ---
  const dataIdParaAssinatura = url.searchParams.get('data.id') || String(paymentId)
  const xSignature = request.headers.get('x-signature') ?? ''
  const xRequestId = request.headers.get('x-request-id') ?? ''

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId: dataIdParaAssinatura,
      secret: (process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '').trim(),
    })
    console.log('Assinatura do webhook: válida')
  } catch (err) {
    console.error('Assinatura do webhook: INVÁLIDA', {
      motivo: err instanceof Error ? err.message : err,
      secretDefinida: Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET),
      xSignature,
      xRequestId,
      dataIdParaAssinatura,
    })
  }
  // --- fim da validação (ainda não bloqueia) ---

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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error)
    return NextResponse.json({ error: 'Erro ao processar notificação' }, { status: 500 })
  }
}