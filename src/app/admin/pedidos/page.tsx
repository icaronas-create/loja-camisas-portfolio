import { createAdminClient } from '@/lib/supabase-admin'

export default async function PedidosAdminPage() {
  const supabase = createAdminClient()

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*, produtos(nome, foto_url, preco)')
    .order('criado_em', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      <div className="border border-gray-200 rounded-lg divide-y">
        {pedidos?.map((pedido) => (
          <div key={pedido.id} className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={pedido.produtos?.foto_url}
                alt={pedido.produtos?.nome}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{pedido.produtos?.nome}</p>
                <p className="text-xs text-gray-500">
                  {pedido.comprador_nome} · {pedido.comprador_email}
                </p>
                <p className="text-xs text-gray-500">
                  {pedido.comprador_telefone} · {pedido.endereco_entrega?.cidade}/
                  {pedido.endereco_entrega?.estado}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  pedido.status_pagamento === 'aprovado'
                    ? 'bg-green-100 text-green-700'
                    : pedido.status_pagamento === 'pendente'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {pedido.status_pagamento}
              </span>
            </div>
          </div>
        ))}

        {pedidos?.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">Nenhum pedido ainda.</p>
        )}
      </div>
    </main>
  )
}