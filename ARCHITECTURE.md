# Arquitetura — minha-comissao-app

## 1. Visão geral

Clean Architecture aplicada por feature (mesmo raciocínio de `domain` /
`data` / `presentation` já usado no Flutter, adaptado pro React). Cada
feature é praticamente autocontida; só o que cruza features de verdade fica
em `shared/`.

Regra de dependência dentro de cada feature:

```
domain            <-- não importa nada de fora dela mesma
  ^
  | implementa a interface
  |
data              <-- implementa as portas do domain, fala com a API
  ^
  | é chamado via container (DI)
  |
presentation      <-- só conhece domain (tipos/usecases) via container.ts,
                       nunca importa data/ diretamente
```

## 2. Convenção de nomenclatura de arquivos

Tudo em inglês agora — nome de domínio e sufixo de camada. Padrão
`<nome-do-domínio>.<sufixo-da-camada>.ts(x)`, kebab-case pra multi-palavra:

| Sufixo | Camada | Exemplo |
|---|---|---|
| `.entity.ts` | domain/entities | `order.entity.ts` |
| `.repository.ts` | domain/repositories (interface/porta) | `order.repository.ts` |
| `.usecase.ts` | domain/usecases | `create-order.usecase.ts` |
| `.dto.ts` | data/models | `order.dto.ts` |
| `.datasource.ts` | data/datasources | `order-http.datasource.ts` |
| `.repository.impl.ts` | data/repositories (implementação) | `order.repository.impl.ts` |
| `.page.tsx` | presentation/pages | `orders.page.tsx` |
| `.hook.ts` | presentation/hooks | `use-order-form.hook.ts` |
| `.container.ts` | raiz da feature (DI) | `orders.container.ts` |

Mapa de tradução dos termos de domínio (usado em nome de feature, entidade e
classe — mas **não** nos campos que viajam no JSON da API, que continuam
exatamente como o backend documenta):

| Termo de negócio (PT) | Nome em código (EN) |
|---|---|
| pedido | order |
| produto | product |
| percentual / comissão | commission rate |
| marceneiro | carpenter |
| comissão (valor calculado) | commission |

**Importante:** os DTOs (`data/models/*.dto.ts`) são a fronteira — eles
espelham o JSON real da API (`idProduto`, `valorPorcentagem`,
`idMarceneiro`, etc., em português, porque é o contrato real do backend) e
o `*.repository.impl.ts` faz o mapeamento pra entidade de domínio em inglês
(`Order`, `Product`...). Nunca renomear um campo de DTO pra "consertar" o
idioma — o DTO existe justamente pra isolar essa diferença.

## 3. Estrutura de pastas

```
src/
├── shared/
│   ├── http/
│   │   └── http-client.ts
│   └── types/
│       └── pagination.ts
│
├── app/
│   ├── app.tsx
│   └── routes.tsx
│
└── features/
    ├── orders/                       (pedidos)
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   └── order.entity.ts
    │   │   ├── repositories/
    │   │   │   └── order.repository.ts
    │   │   └── usecases/
    │   │       ├── create-order.usecase.ts
    │   │       └── list-orders.usecase.ts
    │   ├── data/
    │   │   ├── models/
    │   │   │   └── order.dto.ts
    │   │   ├── datasources/
    │   │   │   └── order-http.datasource.ts
    │   │   └── repositories/
    │   │       └── order.repository.impl.ts
    │   ├── presentation/
    │   │   ├── pages/
    │   │   │   ├── orders.page.tsx
    │   │   │   └── new-order.page.tsx
    │   │   └── hooks/
    │   │       └── use-order-form.hook.ts
    │   └── orders.container.ts
    │
    ├── products/                     (produtos — mesma receita)
    ├── carpenters/                   (marceneiro — CRUD próprio, tela "Meus Marceneiros")
    ├── dashboard/                    (domain leve — usecases agregam dados de outras features via ports)
    └── auth/
        ├── domain/
        │   ├── entities/session.entity.ts
        │   └── repositories/auth.repository.ts
        ├── data/
        │   ├── datasources/auth-http.datasource.ts
        │   ├── datasources/session-storage.datasource.ts
        │   └── repositories/auth.repository.impl.ts
        ├── presentation/
        │   ├── pages/login.page.tsx
        │   └── hooks/use-auth.hook.ts
        └── auth.container.ts
```

## 4. Roteamento (react-router)

O `screen` do `Sidebar` é um valor fixo definido pelo `@mdf/design-system`
(`dashboard` | `novo` | `pedidos` | `produtos` | `marceneiros`) — esse
contrato não muda, é do outro repo. O que muda é o path e o arquivo de
page, que seguem a nomenclatura em inglês:

| screen (fixo, vem do design-system) | path | page |
|---|---|---|
| `dashboard` | `/` | `features/dashboard/presentation/pages/dashboard.page.tsx` |
| `novo` | `/orders/new` | `features/orders/presentation/pages/new-order.page.tsx` |
| `pedidos` | `/orders` | `features/orders/presentation/pages/orders.page.tsx` |
| `produtos` | `/products` | `features/products/presentation/pages/products.page.tsx` |
| `marceneiros` | `/carpenters` | `features/carpenters/presentation/pages/carpenters.page.tsx` |

`percentuais` não existe como screen — `ComissaoPorcentagem` não tem CRUD
exposto no foundation (só `GET`), então não tem tela própria; ver
`TODO.md`.

- `app/routes.tsx` é o único arquivo que importa pages de todas as features
  — nenhuma feature importa outra diretamente.
- `Sidebar.activeScreen` deriva da rota atual (`useLocation`), mapeando path
  → screen key nesse mesmo `routes.tsx`; `onNavigate` chama `navigate(path)`.
- Rota `/login` fora do `AppShellTemplate`; guard local checa token antes de
  renderizar — 401 numa chamada real é o que efetivamente desloga.

## 5. Data-fetching e regra de camadas

- `shared/http/http-client.ts` centraliza: base URL (`VITE_API_URL`), header
  `Authorization: Bearer <token>`, parse do shape de erro padrão do backend
  (`{ statusCode, message }`, `message: string | string[]`), redirect em 401.
- `data/datasources/*.datasource.ts` de cada feature fazem só a chamada
  crua via `HttpClient`, sem regra de negócio, retornando o shape exato da
  API (`*.dto.ts`, campos em português — contrato do backend).
- `data/repositories/*.repository.impl.ts` implementam a interface do
  `domain/repositories/*.repository.ts`, fazendo o mapeamento DTO (PT) →
  entidade de domínio (EN).
- `domain/usecases/*.usecase.ts` recebem a interface (não a implementação)
  por injeção via `<feature>.container.ts`, e concentram regra de negócio
  (ex.: validar que a order tem ao menos um product).
- `presentation/hooks/*.hook.ts` chamam o usecase (via container), guardam
  o dado bruto retornado (entidade de domínio, já em inglês).
- `presentation/pages/*.page.tsx` derivam as versões `*Fmt` (moeda via
  `Intl.NumberFormat`, data via `Intl.DateTimeFormat`) só no momento de
  montar as props dos componentes do `@mdf/design-system` — o design system
  nunca recebe number/Date cru pra exibição, só pra inputs controlados.
- Sem cache compartilhado entre hooks nesta v1 — se duplicidade de fetch
  virar problema real, é decisão a discutir, não implementar "por via das
  dúvidas".
- Paginação: `shared/types/pagination.ts` já modela as duas variantes reais
  da API (`OffsetPagination` para products/comissao-porcentagem,
  `RepeatingPagination` para pedidos/carpenters) — cada `*.repository.ts`
  usa a que for correta pro seu endpoint, nunca uma função genérica que
  assuma `next: number | null` pra
  tudo. `orders/domain/repositories/order.repository.ts` ainda usa
  `OffsetPagination` por engano (débito pré-existente) — `carpenters` é a
  primeira feature a usar `RepeatingPagination` de fato.

## 6. Cálculo de negócio (regra central da order)

```
orderValue      = m2 * product.pricePerM2
orderCommission = orderValue * (commissionRate.value / 100)
```

- Regra pura vive em `domain/entities/order.entity.ts` (função sem I/O).
- Orquestração (recalcular a cada mudança de product/m2/commissionRate) vive
  em `presentation/hooks/use-order-form.hook.ts`, via `useMemo`.
- `isValid` também é calculado no hook (campos obrigatórios preenchidos +
  product/commissionRate existentes na lista carregada) — nunca delegado ao
  componente do design-system.
- `orderValueFmt`/`orderCommissionFmt` derivados do resultado bruto só na
  `orders.page.tsx`/`new-order.page.tsx`, na hora de montar as props do
  `PedidoForm` (o componente em si, do design-system, ainda se chama
  `PedidoForm` — é nome fixo do outro repo, não traduzir na hora de importar).
- **Atenção**: o modelo `m2`/`pricePerM2` vem da documentação do
  design-system; o contrato real de `POST /pedidos` no foundation espera
  `produtos: [{ idProduto, valorProduto, valorPorcentagem }]`, sem campo de
  `m2` explícito. Esse mapeamento (m2 → valorProduto) é responsabilidade do
  `data/repositories/order.repository.impl.ts` — se a regra de conversão
  não estiver clara, reportar a divergência em vez de assumir.

## 7. Auth

- Token gerenciado pela feature `auth`: `data/datasources/session-storage.datasource.ts`
  encapsula `sessionStorage` (guardar/ler/limpar), usado pelo
  `auth.repository.impl.ts`.
- `shared/http/http-client.ts` recebe `getToken`/`onUnauthorized` por
  injeção (vindos do container da feature `auth`) — não importa
  `sessionStorage` direto, pra não acoplar `shared/` a uma feature.
- JWT sem refresh, expira em 15 min — expiração tratada só reagindo ao 401
  real, sem lógica de countdown client-side.
- Todo o controller `/pedidos` exige JWT, incluindo GET.

## 8. Setup de fonte e tokens visuais

- Roboto carregada via `<link>` do Google Fonts no `index.html` (design
  system não empacota a fonte).
- Nenhum valor de cor/espaçamento/raio hardcoded — sempre importar de
  `@mdf/design-system` tokens.

## 9. Variáveis de ambiente

```
VITE_API_URL=http://localhost:3000
```

## 10. Scripts esperados no package.json

```
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```
`pnpm lint`/`pnpm typecheck` rodam antes de considerar qualquer tela pronta
(regra herdada do design-system).