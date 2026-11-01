'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    // Simula o salvamento (ou você pode integrar com o Supabase salvando numa tabela 'newsletter')
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setLoading(false)
    setSuccess(true)
  }

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-14 text-center">
        <h2 className="text-2xl font-black uppercase">Receba os novos garimpos primeiro</h2>
        {success ? (
          <p className="flex items-center gap-2 text-sm text-accent">
            <Check className="size-5" /> Pronto! Você garantiu acesso antecipado e o cupom PRATA10.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="flex-1 border border-primary-foreground/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-primary-foreground/50 text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-foreground px-6 text-xs font-semibold uppercase tracking-widest text-primary transition hover:opacity-90 flex items-center justify-center min-w-[100px]"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Assinar'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}