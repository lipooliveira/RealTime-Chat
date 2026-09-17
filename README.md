# InstaPronto — MVP de loja de serviços Instagram

Aplicação única com **Fastify + TypeScript**, **React/Vite**, **Prisma/SQLite**, Zod e Mercado Pago Checkout Pro. O frontend público jamais recebe custos, margens, tokens ou o preço de origem: o servidor obtém o produto e o valor corrente no banco ao criar um pedido.

## Estrutura

- `src/server`: API, autenticação, integrações Mercado Pago/Telegram e serviços.
- `src/web`: SPA React pública, checkout e painel administrativo.
- `prisma`: schema, migration SQLite e seed dos oito pacotes exigidos.
- `tests`: testes Vitest (adicionar ao instalar dependências).

## Requisitos e instalação

Node.js 20+, npm e uma conta Mercado Pago/Telegram para integrações reais.

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

A loja estará em `http://localhost:5173` no desenvolvimento. Para produção:

```bash
npm run build
npm run start
```

O Fastify entrega `dist/web` em produção na porta `3000` (ou `PORT`). Defina `APP_URL` com a URL HTTPS pública final.

## Verificações

Os comandos disponíveis são `npm run typecheck`, `npm run lint`, `npm run test` e `npm run build`. O lint reutiliza a verificação estática TypeScript para evitar adicionar uma ferramenta de lint desnecessária ao MVP.

## Configuração

Preencha `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET` e `APP_URL`. Nunca faça commit de `.env`. Use segredo longo e aleatório para a sessão.

### Mercado Pago

No painel, em `/admin/configuracoes`, ou no `.env`, informe Access Token e Public Key; os valores persistidos no banco têm prioridade. O backend usa o SDK oficial `mercadopago`, `MercadoPagoConfig` e `Preference.create` para criar uma preferência do **Checkout Pro hospedado**. O cliente é redirecionado para `init_point`; cartão nunca transita pela aplicação.

Em produção, configure obrigatoriamente `MERCADOPAGO_WEBHOOK_SECRET` e cadastre a URL `https://seu-dominio/api/webhooks/mercadopago` nas notificações de pagamento do Mercado Pago. O webhook valida `x-signature` (HMAC SHA-256), busca o pagamento na API e só então altera o pedido. Em testes, use credenciais de teste e uma URL pública de túnel HTTPS. Não há como testar esta etapa sem credenciais reais.

### Telegram

Configure `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` no `.env` ou no painel. Após a primeira aprovação confirmada, a aplicação envia uma única mensagem com venda, custo e lucro ao administrador. Tokens são mascarados e redigidos dos logs.

## Administração

Acesse `/admin`, autentique com as credenciais de ambiente e gerencie produtos, preços/custos, ativação e status de atendimento. O painel mostra custo, lucro bruto e margem; esses dados nunca são expostos pelas APIs públicas. Alterações de preço passam a valer na próxima criação de pedido. Exclusão é uma desativação para preservar histórico.

## Deploy

Execute migration e seed apenas uma vez no ambiente alvo; use volume persistente para o arquivo SQLite. Configure domínio HTTPS, `APP_URL`, cookie seguro e o webhook antes de habilitar produção. Para crescer, substitua a URL do datasource Prisma por PostgreSQL e execute uma migration apropriada; as integrações e modelos permanecem centralizados.

## Limitações deliberadas do MVP

O fornecedor é totalmente manual, não há integração ou automação de entrega. O processamento externo Mercado Pago/Telegram exige credenciais e conectividade reais; este repositório não inclui nenhuma credencial funcional.
