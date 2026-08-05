'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

type Produto = {
  id: string
  nome: string
  time: string
  temporada: string | null
  tamanho: string
  preco: number
  foto_url: string
  categoria_id: string
  descricao: string | null
  status: string
}

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [produto, setProduto] = useState<Produto | null>(null)
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const supabase = createClient()

    supabase.from('categorias').select('id, nome').order('nome').then(({ data }) => {
      if (data) setCategorias(data)
    })

    supabase.from('produtos').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setProduto(data)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()
    const formData = new FormData(e.currentTarget)

    let fotoUrl = produto!.foto_url
    const fotoFile = formData.get('foto') as File

    // Só faz upload de nova foto se o usuário escolheu um arquivo novo
    if (fotoFile && fotoFile.size > 0) {
      const nomeArquivo = `${Date.now()}-${fotoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('fotos-produtos')
        .upload(nomeArquivo, fotoFile)

      if (uploadError) {
        setErro('Erro ao enviar a foto: ' + uploadError.message)
        setCarregando(false)
        return
      }

      const { data } = supabase.storage.from('fotos-produtos').getPublicUrl(nomeArquivo)
      fotoUrl = data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('produtos')
      .update({
        nome: formData.get('nome') as string,
        time: formData.get('time') as string,
        temporada: formData.get('temporada') as string,
        tamanho: formData.get('tamanho') as string,
        preco: parseFloat(formData.get('preco') as string),
        foto_url: fotoUrl,
        categoria_id: formData.get('categoria_id') as string,
        descricao: formData.get('descricao') as string,
        status: formData.get('status') as string,
      })
      .eq('id', id)

    setCarregando(false)

    if (updateError) {
      setErro('Erro ao salvar: ' + updateError.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  async function handleExcluir() {
    if (!confirm('Tem certeza que quer excluir esse produto? Essa ação não pode ser desfeita.')) {
      return
    }

    setCarregando(true)
    const supabase = createClient()
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    setCarregando(false)

    if (error) {
      setErro('Erro ao excluir: ' + error.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  if (!produto) {
    return <main className="max-w-lg mx-auto px-6 py-10">Carregando...</main>
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-6">Editar produto</h1>

      <img
        src={produto.foto_url}
        alt={produto.nome}
        className="w-32 h-32 object-cover rounded-lg mb-4"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Nome do anúncio</label>
          <input
            name="nome"
            defaultValue={produto.nome}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            name="time"
            defaultValue={produto.time}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Temporada</label>
          <input
            name="temporada"
            defaultValue={produto.temporada ?? ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tamanho</label>
          <select
            name="tamanho"
            defaultValue={produto.tamanho}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          >
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
            <option value="XG">XG</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            defaultValue={produto.preco}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Categoria</label>
          <select
            name="categoria_id"
            defaultValue={produto.categoria_id}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          >
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={produto.status}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          >
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">
            Trocar foto <span className="text-gray-400">(deixe em branco pra manter a atual)</span>
          </label>
          <input name="foto" type="file" accept="image/*" className="w-full mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            name="descricao"
            defaultValue={produto.descricao ?? ''}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="bg-black text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {carregando ? 'Salvando...' : 'Salvar alterações'}
        </button>

        <button
          type="button"
          onClick={handleExcluir}
          disabled={carregando}
          className="text-red-600 text-sm underline"
        >
          Excluir produto
        </button>
      </form>
    </main>
  )
}