# minha-comissao-app — Contexto para IA

> Terceiro repositório da suite **minha-comissao**. Consome a API de
> `minha-comissao-foundation` e os componentes de `@mdf/design-system`
> (repo `minha-comissao-design-system`). Leia este arquivo junto com os
> `CLAUDE.md`/documentações dos outros dois repos quando precisar de contrato
> de API ou de props de componente — este arquivo não repete o que já está lá.

## 1. Visão geral do produto

App "Minha Comissão": vendedor/marceneiro de chapas de MDF cadastra produtos,
percentuais de comissão e registra pedidos. O app calcula valor do pedido e
comissão a partir do que o usuário digita — nenhum cálculo é feito no backend
nem no design system.

4 telas (`screen` é valor fixo do `Sidebar` do design-system — não traduzir).
Tela `percentuais`/"Comissões" foi removida (Sidebar, rotas e feature
`commission-rates`) enquanto `ComissaoPorcentagem` não tiver CRUD exposto no
foundation — ver `TODO.md`.

| screen key    | Página          | Organism principal          |
| -------------- | --------------- | ---------------------------- |
| `dashboard`    | Resumo          | `DashboardSummary`           |
| `novo`         | Novo Pedido     | `PedidoForm`                 |
| `pedidos`      | Meus Pedidos    | `PedidosList`                |
| `produtos`     | Minhas Chapas   | `ProdutosList` + `ProdutoForm` |

## 2. Stack e decisões de arquitetura

- React 19 + TypeScript
- Vite (SPA) — sem SSR, app interno de uso autenticado
- `react-router-dom` para roteamento entre as 4 telas
- Data-fetching: `fetch` nativo + hooks próprios (sem TanStack Query) —
  cálculo de negócio (valor/comissão) sempre no app, nunca delegado a lib
- Gerenciador de pacotes: pnpm (padrão dos repos irmãos)
- `@mdf/design-system` como dependência (peer deps `react`/`react-dom`
  declaradas aqui, versão própria)
- **Clean Architecture por feature** (`domain` / `data` / `presentation`
  dentro de cada feature — mesmo raciocínio já usado no Flutter, adaptado
  pro React), com interfaces/DI local via `<feature>.container.ts`.
- **Nomenclatura de arquivo e código 100% em inglês**:
  `<domínio>.<sufixo-da-camada>.ts(x)`, kebab-case pra multi-palavra — ex.:
  `order.repository.ts`, `create-order.usecase.ts`,
  `use-order-form.hook.ts`. Features: `orders` (pedidos), `products`
  (produtos), `carpenters` (marceneiro). Feature `commission-rates`
  (percentuais) foi removida — ver seção 1.
  Exceção: os campos dentro de `*.dto.ts` continuam em português, pois
  espelham o JSON real da API do foundation — a tradução acontece no
  `*.repository.impl.ts`, na fronteira entre `data` e `domain`. Ver
  `ARQUITETURA.md` seção 2 para a tabela completa de sufixos e o mapa de
  tradução dos termos de domínio.

## 3. Regras herdadas dos repos irmãos (valem aqui também)

- Documentação prevalece sobre código — em divergência, reportar, nunca
  assumir silenciosamente qual está certo.
- Nunca criar novo padrão arquitetural (novo state manager, nova lib de
  data-fetching, trocar Clean Architecture por outra coisa, etc.) sem
  atualizar este documento e o `ARQUITETURA.md` primeiro.
- Nunca alterar a arquitetura definida sem pedido explícito do usuário.
- Nunca inventar endpoints/campos que a API do foundation não expõe (ex.:
  CRUD de `ComissaoPorcentagem`, cadastro de usuário — não existem).
- Nunca duplicar visual do design-system dentro do mdf-app. Se faltar um
  componente ou variante, a mudança é no repo `minha-comissao-design-system`,
  não aqui.
- Nunca adicionar dependência nova sem justificar.
- Nunca quebrar a direção de dependência dentro de uma feature: `domain`
  não importa `data` nem `presentation`; `presentation` só fala com
  `domain` (tipos/usecases) via `<feature>.container.ts`, nunca importa
  `data/` diretamente.
- Nunca importar uma feature de dentro de outra feature diretamente — o que
  for genuinamente compartilhado sobe pra `shared/`; a composição entre
  features (se precisar) acontece em `app/`.
- Nunca renomear campo de DTO pra "traduzir" pro inglês — o DTO existe pra
  isolar o contrato real da API (em português) da entidade de domínio (em
  inglês); a tradução é sempre feita explicitamente no `*.repository.impl.ts`.

## 4. Regras de dados que já causam bug se ignoradas

- `GET /pedidos` do foundation retorna `valor`/`porcentagem` como **string
  formatada em BRL/%** — nunca usar esse endpoint como fonte de valor
  numérico para cálculo. O valor numérico vem do que foi enviado no
  create/update, guardado no estado local.
- Paginação **não é uniforme** entre endpoints:
  - `produtos`/`marceneiro`: `pagination.next` é `number | null`.
  - `pedidos`: `next` **repete** o valor de `current` quando não há próxima
    página (nunca é `null`). Comparar `next !== current`, não `next !== null`.
  - Modelado em `shared/types/pagination.ts` como dois tipos distintos
    (`OffsetPagination` / `RepeatingPagination`) — nunca abstrair como se
    fossem iguais.
- Componentes do design-system recebem props `*Fmt` (moeda/data/percentual)
  **já formatadas como string** — formatar com `Intl.NumberFormat` /
  `Intl.DateTimeFormat` só em `presentation/pages/*.page.tsx`, nunca no
  design-system, nunca guardar a versão formatada no estado bruto do hook.
- Auth: JWT sem refresh, expira em 15 min (`JWT_EXPIRATION` padrão). Guardar
  token, anexar em toda chamada protegida, redirecionar pro login em 401.
  Todo o controller `/pedidos` exige JWT, **incluindo GET**.
- Divergência de modelo em aberto: o design-system documenta
  `Produto.valorPorM2`/`Pedido.m2` (`product.pricePerM2`/`order.m2` no
  domínio traduzido), mas o contrato real de `POST /pedidos` no foundation
  espera `produtos: [{ idProduto, valorProduto, valorPorcentagem }]`, sem
  `m2`. O mapeamento vive em
  `features/orders/data/repositories/order.repository.impl.ts` — se a
  regra de conversão não estiver clara, reportar, não assumir.

## 5. Camadas do app

```
src/
  shared/       # só o que cruza features de verdade (http-client, pagination)
  app/          # app.tsx + routes.tsx (único lugar que importa pages de todas as features)
  features/
    orders/             (pedidos)
      domain/          # entities/, repositories/ (interface), usecases/
      data/             # models/ (dto), datasources/, repositories/ (impl)
      presentation/     # pages/, hooks/
      orders.container.ts   # DI local: datasource -> repository -> usecases
    products/           (produtos — mesma receita)
    carpenters/          (marceneiro — idem)
    dashboard/           (idem)
    auth/                (idem)
```

Ver `ARQUITETURA.md` para o detalhe de cada camada, fluxo de dados completo,
o mapa de tradução dos termos de domínio e a tabela de convenção de
nomenclatura por sufixo.