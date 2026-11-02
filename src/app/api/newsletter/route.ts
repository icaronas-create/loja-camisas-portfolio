import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase' 

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

    if (dbError && dbError.code !== '23505') {
      console.error('Erro no Supabase:', dbError)
      return NextResponse.json({ error: 'Erro de BD: ' + dbError.message }, { status: 500 })
    }

    // Sucesso! (Disparo de e-mail desativado até configurar domínio próprio)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro geral na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}