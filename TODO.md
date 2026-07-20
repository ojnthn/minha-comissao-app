# TODO — gaps entre a API real e o que a home/dashboard precisaria

Levantado ao implementar a feature de home (`dashboard`). Ver `CLAUDE.md`
seção 3/4 e `docs/new-feature-guide.md` — regra do projeto é reportar
divergência de contrato, nunca assumir/inventar endpoint ou campo.

## Backend (`minha-venda-foundation`)

- [ ] **Ainda sem endpoint de agregados do dashboard.** `detalhes[].valor`
  é `{ total, comissao }`, mas os dois campos continuam string formatada
  (`"R$ 1.500,00"`) — segue valendo a regra de nunca usar esse endpoint
  como fonte numérica pra cálculo (CLAUDE.md seção 4). Não dá pra calcular
  "vendido este mês" / "comissão este mês" (com tendência vs. mês anterior)
  no frontend sem um endpoint que devolva números crus ou já agregados. Os
  dois `StatCard` da home continuam mostrando `"Indisponível"`
  (`src/features/dashboard/presentation/pages/dashboard.page.tsx`).
- [x] **`Produto` agora tem campo de preço.** `POST/PATCH /produtos` no
  foundation tem `valorPorM2` (double, obrigatório) e `features/products`
  (`Product.pricePerM2`) consome o campo real do backend.
- [x] **Cadastro de pedido (`new-order.page.tsx`) implementado (2026-07-20).**
  Deixou de ser placeholder: `orders` ganhou `domain/entities/order.entity.ts`
  (itens + cálculo puro), `create-order.usecase.ts`,
  `order-form-options.repository.ts` (port pra marceneiro/produto/percentual),
  `use-order-form.hook.ts` e a página real, usando os novos organisms
  `PedidoInfoForm`/`PedidoItemForm` do design-system (substituíram o
  `PedidoForm` de item único, nunca consumido). Pedido pode ter N produtos —
  ver seção 6 do `ARCHITECTURE.md`.
- [x] **`ComissaoPorcentagem`: `GET /comissao-porcentagem` agora expõe
  `valor` numérico** (antes só `descricao`, string formatada tipo `"7%"`),
  necessário pro cálculo de comissão em `orders`. Segue sem POST/PATCH/DELETE
  — a feature `commission-rates` (tela própria de gestão) continua removida
  do app até esses endpoints existirem, ver `CLAUDE.md` seção 1. Onboarding
  da home segue só checando `hasProducts`, não percentual.

## Frontend (`minha-comissao-app`)

- [ ] Quando o item de agregado do dashboard acima existir no backend,
  trocar o placeholder `"Indisponível"` dos `StatCard` por valor real +
  `TrendIndicator`.
- [ ] Quando `ComissaoPorcentagem` tiver POST/PATCH/DELETE: recriar a
  feature `commission-rates` (scaffold em `docs/new-feature-guide.md`),
  devolver `'percentuais'` ao `SidebarScreen`/nav do design-system e à
  rota `/commission-rates` em `app/routes.tsx`; atualizar `needsOnboarding`
  (hoje só `!hasProducts`) pra também checar percentual, e o
  `OnboardingCard` da home pra voltar a ter os dois passos do mockup
  (`Minhas Vendas - Clássico (offline).html`).
