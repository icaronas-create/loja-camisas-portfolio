import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase' // Ajuste o caminho se necessário
import { resend } from '@/lib/resend' // Ajuste o caminho se necessário

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
    }

    // 1. Guardar o e-mail no Supabase
    const { error: dbError } = await supabase
      .from('newsletter')
      .insert([{ email }])

    // Se o erro for de duplicidade (código 23505), não há problema, o utilizador já está inscrito
    if (dbError && dbError.code !== '23505') {
      throw new Error(dbError.message)
    }

    // 2. Enviar o e-mail de boas-vindas com o cupão via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Pratas da Casa <contato@seusite.com>', // Substitua pelo seu domínio verificado no Resend
      to: email,
      subject: 'Bem-vindo(a) ao Pratas da Casa! ⚽ Seu cupão chegou',
      html: `
        <h2>Toda camisa tem uma história!</h2>
        <p>Obrigado por se juntar à nossa lista VIP.</p>
        <p>Utilize o cupão <strong>PRATA10</strong> na sua primeira compra e ganhe 10% de desconto.</p>
        <br/>
        <p>Fique atento, receberá os nossos novos garimpos antes de toda a gente!</p>
      `,
    })

    if (emailError) {
      throw new Error(emailError.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na newsletter:', error)
    return NextResponse.json({ error: 'Erro ao processar a subscrição' }, { status: 500 })
  }
}