'use client'

import { useState } from 'react'

type ProductGalleryProps = {
  fotoUrl: string
  galeria?: string[] | null
}

export default function ProductGallery({ fotoUrl, galeria }: ProductGalleryProps) {
  // Junta a foto principal com as fotos da galeria (se existirem)
  const todasAsFotos = [fotoUrl, ...(galeria || [])].filter(Boolean)
  
  // Estado que controla qual imagem está em destaque
  const [imagemPrincipal, setImagemPrincipal] = useState(todasAsFotos[0])

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Imagem Principal */}
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
        <img 
          src={imagemPrincipal} 
          alt="Detalhe do produto" 
          className="h-full w-full object-cover mix-blend-multiply" 
        />
      </div>

      {/* Miniaturas (Só aparecem se houver mais de 1 foto) */}
      {todasAsFotos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
          {todasAsFotos.map((foto, idx) => (
            <button
              key={idx}
              onClick={() => setImagemPrincipal(foto)}
              className={`h-24 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                imagemPrincipal === foto 
                  ? 'border-foreground opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={foto} 
                alt={`Miniatura ${idx + 1}`} 
                className="h-full w-full object-cover mix-blend-multiply bg-neutral-100" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}