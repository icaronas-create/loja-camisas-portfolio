import { createAdminClient } from '@/lib/supabase-admin'
import { payment } from '@/lib/mercadopago'
import { WebhookSignatureValidator } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const body = await request.json()

  // --- Validação de assinatura: por enquanto só REGISTRA o resultado, não bloqueia nada ainda.
  // Isso evita quebrar o fluxo que já está funcionando, até confirmarmos que bate certo.
  const dataIdParaAssinatura = url.searchParams.get('data.id') || String(body?.data?.id ?? '')
  const xSignature = request.headers.get('x-signature') ?? ''
  const xRequestId = request.headers.get('x-request-id') ?? ''

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId: dataIdParaAssinatura,
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET!,
    })
    console.log('Assinatura do webhook: válida')
  } catch (err) {
    console.error('Assinatura do webhook: INVÁLIDA', { xSignature, xRequestId, dataIdParaAssinatura })
  }
  // --- fim da validação (ainda não bloqueia) ---

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