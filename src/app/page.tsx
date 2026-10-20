// Exemplo da estrutura visual para o seu src/app/page.tsx

export default function HomePage() {
  return (
    <div className="bg-noise min-h-screen w-full text-[#e5e5e5]">
      
      {/* HERO SECTION COM FOTO DE BRECHÓ VISÍVEL */}
      <section className="relative min-h-[500px] lg:min-h-[560px] flex items-center overflow-hidden">
        {/* Imagem de fundo real */}
        <img
          src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1920&q=85"
          alt="Araras de camisas de brechó"
          className="absolute inset-0 w-full h-full object-cover object-center filter contrast-110 brightness-75"
        />
        
        {/* Sombra escura apenas do lado esquerdo para leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0b] via-[#0a0b0b]/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] text-[#f0f0ec] leading-[1.06] tracking-tight uppercase mb-5">
              Camisas de time,<br />
              História de<br />
              Verdade
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Peças de brechó selecionadas uma a uma — cada camisa é única e só existe um exemplar.
            </p>
            <a
              href="#catalogo"
              className="inline-block bg-[#1b3024] hover:bg-[#254231] text-neutral-200 text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded border border-[#3e5c4a] transition shadow-lg"
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* DIVISÓRIA ESTILO TICKET RASGADO */}
      <div className="ticket-divider w-full flex items-center justify-around text-[10px] font-mono-tech font-bold text-neutral-900 uppercase tracking-widest overflow-hidden select-none">
        <span>★ PRATAS DA CASA</span>
        <span>AUTHENTIC VINTAGE CLUB</span>
        <span>★ PEÇA ÚNICA</span>
        <span>HISTÓRIA DE VERDADE</span>
        <span className="hidden sm:inline">★ DROP #01</span>
      </div>

      {/* SECÇÃO CATÁLOGO (Ocupa 100% de fundo escuro, conteúdo centralizado em max-w-7xl) */}
      <section id="catalogo" className="w-full bg-[#0f1010] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Cabeçalho Últimos Lançamentos */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-800">
            <span className="text-neutral-400 text-xl">★</span>
            <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase text-[#e5e5e0] text-center">
              Últimos Lançamentos
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-base filter grayscale">⚽</span>
              <span className="font-condensed text-sm tracking-widest uppercase text-neutral-300">
                DROP #01
              </span>
            </div>
          </div>

          {/* 
            Coloque aqui a sua barra de pesquisa ("Buscar por time...") 
            e a grelha dos seus produtos! 
          */}

        </div>
      </section>

    </div>
  );
}