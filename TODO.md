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
- [ ] **`Produto` não tem campo de preço.** O real (`nome` +
  `idComissaoPorcentagemPadrao`) diverge do que `CLAUDE.md`/design-system
  documentam (`Produto.valorPorM2`). Hoje o valor de cada item é digitado
  direto na criação do pedido (`produtos[].valorProduto`), não vem de um
  cadastro de preço por chapa.
- [ ] **`ComissaoPorcentagem` sem CRUD exposto.** Já documentado em
  `docs/new-feature-guide.md`. Efeitos: feature `commission-rates`
  removida do app (pasta, rota `/commission-rates`, item "Comissões" do
  Sidebar e `SidebarScreen` no design-system) até o endpoint existir — ver
  `CLAUDE.md` seção 1. Onboarding da home só consegue checar se existe
  produto cadastrado (`hasProducts`) — não dá pra checar se existe
  percentual, então o card de onboarding hoje só orienta "adicionar
  chapa", não os dois passos do mockup original.

## Frontend (`minha-comissao-app`)

- [ ] **`GET /auth` (retorna `{ nome, email }` do usuário logado) já
  existe no foundation** (`auth.controller.ts` → `MeUseCase`) mas a
  feature `auth` daqui ainda não consome — só guarda o token
  (`session-storage.datasource.ts`), sem nome/email. Adicionar `getMe()`
  em `auth-http.datasource.ts`/`auth.repository.impl.ts` pra poder
  personalizar a home ("Olá, `<nome>`") e qualquer tela que precise exibir
  o usuário logado. Agora também bloqueia o `Topbar` (`userName`/`userRole`/
  `userInitials` obrigatórios) — `ShellLayout` (`src/app/routes.tsx`) usa
  `"Indisponível"`/`"?"` como placeholder até isso existir.
- [ ] Quando o item de agregado do dashboard acima existir no backend,
  trocar o placeholder `"Indisponível"` dos `StatCard` por valor real +
  `TrendIndicator`.
- [ ] Quando `ComissaoPorcentagem` tiver endpoint de leitura: recriar a
  feature `commission-rates` (scaffold em `docs/new-feature-guide.md`),
  devolver `'percentuais'` ao `SidebarScreen`/nav do design-system e à
  rota `/commission-rates` em `app/routes.tsx`; atualizar `needsOnboarding`
  (hoje só `!hasProducts`) pra também checar percentual, e o
  `OnboardingCard` da home pra voltar a ter os dois passos do mockup
  (`Minhas Vendas - Clássico (offline).html`).
