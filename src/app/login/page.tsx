'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem({ texto: '', tipo: '' })

    try {
      if (isLogin) {
        // Tentar Fazer Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        })
        if (error) throw error
        
        router.push('/') // Redireciona para a home após o login
        router.refresh()
      } else {
        // Tentar Criar Conta
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        })
        if (error) throw error
        
        setMensagem({ 
          texto: 'Conta criada! Se necessário, verifique o seu e-mail.', 
          tipo: 'sucesso' 
        })
      }
    } catch (error: any) {
      setMensagem({ texto: error.message, tipo: 'erro' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md bg-card p-8 border border-border shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black uppercase tracking-wider text-primary-foreground">
            {isLogin ? 'Iniciar Sessão' : 'Criar Conta'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin 
              ? 'Aceda aos seus pedidos e garimpos guardados.' 
              : 'Junte-se ao clube e garanta acesso aos novos garimpos.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-muted-foreground">
              E-mail
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="O seu e-mail"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-muted-foreground">
              Senha
            </label>
            <input
              required
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="A sua senha"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {mensagem.texto && (
            <p className={`text-xs mt-1 ${mensagem.tipo === 'erro' ? 'text-destructive' : 'text-accent'}`}>
              {mensagem.texto}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-primary-foreground py-3.5 text-xs font-semibold uppercase tracking-widest text-primary transition hover:opacity-90 flex items-center justify-center h-12"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : (isLogin ? 'Entrar' : 'Registar')}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Ainda não tem conta?' : 'Já faz parte do clube?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setMensagem({ texto: '', tipo: '' })
              }}
              className="ml-2 text-primary-foreground font-semibold hover:text-accent transition-colors underline underline-offset-4"
            >
              {isLogin ? 'Criar agora' : 'Faça login'}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Voltar para a loja
          </Link>
        </div>

      </div>
    </div>
  )
}