# Pratas da Casa | E-commerce de Camisas Retrô

Plataforma full-stack de e-commerce desenvolvida para venda de camisas de futebol vintage e de colecionador. O projeto inclui vitrine, autenticação de usuários, carrinho de compras e um painel administrativo completo.

## 🚀 Funcionalidades

- **Vitrine e Busca**: Catálogo dinâmico com filtros por categoria, busca textual e galeria de imagens por produto.
- **Autenticação**: Sistema de login/cadastro de usuários integrado ao Supabase Auth.
- **Painel do Cliente**: Área logada para visualização de pedidos, edição de perfil e gerenciamento de endereços.
- **Painel Administrativo (`/admin`)**: CRUD completo de produtos, gestão de categorias, controle de estoque (status) e upload de múltiplas imagens (Supabase Storage).
- **Checkout Integrado**: Preparado para integração via Webhooks com Mercado Pago.
- **Captura de Leads**: Sistema de newsletter conectado ao banco de dados.

## 🛠️ Tecnologias Utilizadas

- **Front-end**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Back-end & BaaS**: Supabase (PostgreSQL, Authentication, Storage, Row Level Security).
- **Pagamentos**: Mercado Pago API (Webhooks).
- **Deploy**: Vercel.

## ⚙️ Como executar localmente

1. Clone o repositório:
```bash
git clone [https://github.com/SEU_USUARIO/loja-camisas-portfolio.git](https://github.com/SEU_USUARIO/loja-camisas-portfolio.git)
