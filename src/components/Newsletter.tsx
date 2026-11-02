'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('Falha ao registar')
      
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-14 text-center">
        <h2 className="text-2xl font-black uppercase">Receba os novos garimpos primeiro</h2>
        
        {success ? (
          <p className="flex items-center gap-2 text-sm text-accent">
            <Check className="size-5" /> Pronto! Você garantiu acesso antecipado às novidades.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-2">
            <div className="flex w-full">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="O seu melhor e-mail"
                className="flex-1 border border-primary-foreground/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-primary-foreground/50 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-foreground px-6 text-xs font-semibold uppercase tracking-widest text-primary transition hover:opacity-90 flex items-center justify-center min-w-[100px]"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Assinar'}
              </button>
            </div>
            {error && (
              <p className="text-xs text-destructive text-left mt-1">
                Ocorreu um erro. Tente novamente mais tarde.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}