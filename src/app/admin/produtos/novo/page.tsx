'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function NovoProdutoPage() {
  const router = useRouter()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([])

  useState(() => {
    const supabase = createClient()
    supabase.from('categorias').select('id, nome').order('nome').then(({ data }) => {
      if (data) setCategorias(data)
    })
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()
    const formData = new FormData(e.currentTarget)

    const fotoFile = formData.get('foto') as File
    const fotoEtiquetaFile = formData.get('foto_etiqueta') as File

    if (!fotoFile || fotoFile.size === 0) {
      setErro('A foto principal é obrigatória.')
      setCarregando(false)
      return
    }

    // Upload da foto principal
    const nomeArquivo = `${Date.now()}-${fotoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('fotos-produtos')
      .upload(nomeArquivo, fotoFile)

    if (uploadError) {
      setErro('Erro ao enviar a foto: ' + uploadError.message)
      setCarregando(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fotos-produtos')
      .getPublicUrl(nomeArquivo)

    // Upload da foto da etiqueta (opcional)
    let fotoEtiquetaUrl = null
    if (fotoEtiquetaFile && fotoEtiquetaFile.size > 0) {
      const nomeArquivoEtiqueta = `${Date.now()}-etiqueta-${fotoEtiquetaFile.name}`
      const { error: uploadEtiquetaError } = await supabase.storage
        .from('fotos-produtos')
        .upload(nomeArquivoEtiqueta, fotoEtiquetaFile)

      if (!uploadEtiquetaError) {
        const { data } = supabase.storage
          .from('fotos-produtos')
          .getPublicUrl(nomeArquivoEtiqueta)
        fotoEtiquetaUrl = data.publicUrl
      }
    }

    // Inserir produto no banco
    const { error: insertError } = await supabase.from('produtos').insert({
      nome: formData.get('nome') as string,
      time: formData.get('time') as string,
      temporada: formData.get('temporada') as string,
      tamanho: formData.get('tamanho') as string,
      preco: parseFloat(formData.get('preco') as string),
      foto_url: publicUrl,
      foto_etiqueta_url: fotoEtiquetaUrl,
      categoria_id: formData.get('categoria_id') as string,
      descricao: formData.get('descricao') as string,
    })

    setCarregando(false)

    if (insertError) {
      setErro('Erro ao salvar produto: ' + insertError.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-6">Novo produto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Nome do anúncio</label>
          <input
            name="nome"
            required
            placeholder="REAL MADRID 1999/00 RESERVA"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            name="time"
            required
            placeholder="Real Madrid"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Temporada</label>
          <input
            name="temporada"
            placeholder="1999/00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tamanho</label>
          <select
            name="tamanho"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          >
            <option value="">Selecione</option>
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
            required
            placeholder="299.90"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Categoria</label>
          <select
            name="categoria_id"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
          >
            <option value="">Selecione</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Foto principal</label>
          <input
            name="foto"
            type="file"
            accept="image/*"
            required
            className="w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Foto da etiqueta <span className="text-gray-400">(opcional, mas recomendado)</span>
          </label>
          <input
            name="foto_etiqueta"
            type="file"
            accept="image/*"
            className="w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            name="descricao"
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
          {carregando ? 'Salvando...' : 'Salvar produto'}
        </button>
      </form>
    </main>
  )
}