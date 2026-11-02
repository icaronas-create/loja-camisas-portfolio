'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin, Mail, ChevronRight, Check, X } from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'orders' | 'perfil'>('orders')
  const [userEmail, setUserEmail] = useState('')
  const [marketing, setMarketing] = useState(false)

  // Novos estados para edição
  const [nome, setNome] = useState('Carregando...')
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  
  const [enderecos, setEnderecos] = useState([
    'Praça Edmundo Rego, 5, AP 301, 20561-130 Rio de Janeiro, Brasil'
  ])
  const [editandoEndereco, setEditandoEndereco] = useState(false)
  const [novoEndereco, setNovoEndereco] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserEmail(session.user.email || '')
        // Puxa o nome salvo ou define um padrão
        setNome(session.user.user_metadata?.nome || 'Usuário')
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Salva o novo nome no Supabase Auth
  const salvarPerfil = async () => {
    if (!nome.trim()) return
    await supabase.auth.updateUser({
      data: { nome: nome }
    })
    setEditandoPerfil(false)
  }

  const adicionarEndereco = () => {
    if (novoEndereco.trim()) {
      setEnderecos([novoEndereco, ...enderecos])
      setNovoEndereco('')
      setEditandoEndereco(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        
        <aside className="w-full md:w-64 flex flex-col gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-left text-lg ${activeTab === 'orders' ? 'font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`text-left text-lg ${activeTab === 'perfil' ? 'font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Perfil
          </button>
        </aside>

        <main className="flex-1">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src="/j3.jpg" alt="Camisa" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Confirmado</h3>
                    <p className="text-sm text-muted-foreground mt-1">#17593 · R$ 137,90 BRL</p>
                  </div>
                </div>
                <button className="px-6 py-2 border border-border rounded-full text-sm font-medium hover:bg-neutral-100 hover:text-black transition-colors w-full sm:w-auto">
                  Comprar novamente
                </button>
              </div>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="space-y-10 max-w-2xl">
              
              {/* Seção de Perfil Editável */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                  {!editandoPerfil && (
                    <button 
                      onClick={() => setEditandoPerfil(true)}
                      className="px-4 py-1.5 border border-border rounded-full text-sm hover:bg-neutral-100 hover:text-black transition"
                    >
                      Editar
                    </button>
                  )}
                </div>
                
                {editandoPerfil ? (
                  <div className="border border-border rounded-lg p-4 bg-card space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">Nome Completo</label>
                      <input 
                        type="text" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={salvarPerfil} className="flex items-center gap-1 bg-foreground text-background px-4 py-2 text-xs uppercase font-semibold">
                        <Check className="size-4" /> Salvar
                      </button>
                      <button onClick={() => setEditandoPerfil(false)} className="flex items-center gap-1 border border-border px-4 py-2 text-xs uppercase font-semibold hover:bg-neutral-100 hover:text-black transition">
                        <X className="size-4" /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg px-4 py-3 flex items-center justify-between bg-card">
                    <span className="text-sm text-muted-foreground">E-mail</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{nome}</p>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Endereços Editável */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Endereços</h3>
                  {!editandoEndereco && (
                    <button 
                      onClick={() => setEditandoEndereco(true)}
                      className="px-4 py-1.5 border border-border rounded-full text-sm hover:bg-neutral-100 hover:text-black transition"
                    >
                      Adicionar
                    </button>
                  )}
                </div>

                {editandoEndereco && (
                  <div className="border border-border rounded-lg p-4 bg-card mb-4 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">Novo Endereço Completo</label>
                      <input 
                        type="text" 
                        value={novoEndereco}
                        onChange={(e) => setNovoEndereco(e.target.value)}
                        placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={adicionarEndereco} className="flex items-center gap-1 bg-foreground text-background px-4 py-2 text-xs uppercase font-semibold">
                        <Check className="size-4" /> Salvar
                      </button>
                      <button onClick={() => setEditandoEndereco(false)} className="flex items-center gap-1 border border-border px-4 py-2 text-xs uppercase font-semibold hover:bg-neutral-100 hover:text-black transition">
                        <X className="size-4" /> Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {enderecos.map((end, index) => (
                    <div key={index} className="border border-border rounded-lg px-4 py-4 flex items-center justify-between bg-card cursor-pointer hover:border-foreground transition">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 bg-neutral-100 p-2 rounded-full text-black">
                          <MapPin className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {nome} {index === 0 && <span className="ml-2 text-[10px] bg-neutral-200 text-black px-2 py-0.5 rounded-sm uppercase tracking-wider">Padrão</span>}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{end}</p>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Preferências de marketing</h3>
                <div className="border border-border rounded-lg px-4 py-4 flex items-center justify-between bg-card">
                  <div className="flex items-center gap-3">
                    <Mail className="size-5 text-muted-foreground" />
                    <span className="text-sm">E-mail</span>
                  </div>
                  <button 
                    onClick={() => setMarketing(!marketing)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${marketing ? 'bg-primary-foreground' : 'bg-neutral-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full transition-transform ${marketing ? 'bg-primary translate-x-5' : 'bg-white translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2 border border-border rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                >
                  Sair
                </button>
                <span className="text-sm text-muted-foreground">Sair de todos os dispositivos</span>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}