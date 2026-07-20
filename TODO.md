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
- [x] **`Produto` agora tem campo de preço.** Reaberto e resolvido de novo,
  na direção oposta da entrada anterior: `POST/PATCH /produtos` no foundation
  passou a ter `valorPorM2` (double, obrigatório) e `ProdutoForm`
  (design-system, `@ojnthn/minhas-venda-design-system@1.0.6`) reintroduziu o
  campo "Valor do m²". `features/products` (`Product.pricePerM2`) já consome
  o campo real do backend. **Segue em aberto**: `PedidoForm`/`orders` ainda
  não usam `pricePerM2` no cálculo do pedido (`orderValue = m2 *
  product.pricePerM2` da seção 6 do `ARCHITECTURE.md`) — `new-order.page.tsx`
  continua um placeholder ("em construção"), sem usecase/hook de criação de
  pedido implementado. Isso é o próximo passo pra fechar o ciclo completo.
- [ ] **`ComissaoPorcentagem` não tem CRUD completo, mas o `GET` existe.**
  `docs/new-feature-guide.md` segue correto quanto a não ter
  POST/PATCH/DELETE — feature `commission-rates` (tela própria de gestão)
  continua removida do app (pasta, rota `/commission-rates`, item
  "Comissões" do Sidebar e `SidebarScreen` no design-system) até esses
  endpoints existirem — ver `CLAUDE.md` seção 1. Mas `GET
  /comissao-porcentagem` (`{ pagination, detalhes: [{ id, descricao }] }`)
  é real e já está em uso: `features/products` consome via
  `commission-rate.repository.ts`/`list-commission-rate-options.usecase.ts`
  só pra popular o select "Comissão padrão" do cadastro de chapa — não é
  a feature `commission-rates` de volta, só leitura pontual. Onboarding
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
