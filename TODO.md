# TODO — gaps entre a API real e o que a home/dashboard precisaria

Levantado ao implementar a feature de home (`dashboard`). Ver `CLAUDE.md`
seção 3/4 e `docs/new-feature-guide.md` — regra do projeto é reportar
divergência de contrato, nunca assumir/inventar endpoint ou campo.

## Backend (`minha-venda-foundation`)

- [x] ~~`GET /pedidos` não devolve data do pedido.~~ Resolvido: response
  agora traz `detalhes[].data` (`DD/MM/YYYY`, data de cadastro). Consumido
  em `dashboard.composition.ts`/`dashboard.page.tsx` (`dateFormatted` →
  `dataFmt`).
- [x] ~~Sem parâmetro de ordenação em `GET /pedidos`.~~ Resolvido: novo
  query param `ordem` (`"mais-antigo" | "mais-novo"`). O usecase
  `list-recent-orders.usecase.ts` agora faz 1 chamada só, com
  `order: 'mais-novo'`, sem precisar descobrir `total` nem cortar no
  cliente. `pagination.next` também passou a ser `number | null` (igual
  produtos/marceneiro) — `RepeatingPagination` foi removido de
  `shared/types/pagination.ts`.
- [ ] **Ainda sem endpoint de agregados do dashboard.** `detalhes[].valor`
  agora é `{ total, comissao }`, mas os dois campos continuam string
  formatada (`"R$ 1.500,00"`) — segue valendo a regra de nunca usar esse
  endpoint como fonte numérica pra cálculo (CLAUDE.md seção 4). Não dá pra
  calcular "vendido este mês" / "comissão este mês" (com tendência vs. mês
  anterior) no frontend sem um endpoint que devolva números crus ou já
  agregados. Os dois `StatCard` da home continuam mostrando
  `"Indisponível"` (`src/features/dashboard/presentation/pages/dashboard.page.tsx`).
- [ ] **`Produto` não tem campo de preço.** O real (`nome` +
  `idComissaoPorcentagemPadrao`) diverge do que `CLAUDE.md`/design-system
  documentam (`Produto.valorPorM2`). Hoje o valor de cada item é digitado
  direto na criação do pedido (`produtos[].valorProduto`), não vem de um
  cadastro de preço por chapa.
- [ ] **`ComissaoPorcentagem` sem CRUD exposto.** Já documentado em
  `docs/new-feature-guide.md`. Efeitos: feature `commission-rates`
  inteira bloqueada, e o onboarding da home só consegue checar se existe
  produto cadastrado (`hasProducts`) — não dá pra checar se existe
  percentual, então o card de onboarding hoje só orienta "adicionar
  chapa", não os dois passos do mockup original.
## Frontend (`minha-comissao-app`)

- [ ] **`GET /auth` (retorna `{ nome, email }` do usuário logado) já
  existe no foundation** (`auth.controller.ts` → `MeUseCase`) mas a
  feature `auth` daqui ainda não consome — só guarda o token
  (`session-storage.datasource.ts`), sem nome/email. Adicionar
  `getMe()` em `auth-http.datasource.ts`/`auth.repository.impl.ts` pra
  poder personalizar a home ("Olá, `<nome>`") e qualquer tela que
  precise exibir o usuário logado.

- [x] ~~Trocar `dataFmt`/`comissaoFmt` (hoje `"—"`) nos pedidos
  recentes.~~ Resolvido junto com o contrato novo de `GET /pedidos`
  (`data`/`valor.comissao`).
- [ ] Quando o item de agregado do dashboard acima existir no backend,
  trocar o placeholder `"Indisponível"` dos `StatCard` por valor real +
  `TrendIndicator`.
- [ ] Quando `ComissaoPorcentagem` tiver endpoint de leitura, atualizar
  `needsOnboarding` (hoje só `!hasProducts`) pra também checar percentual,
  e o `OnboardingCard` da home pra voltar a ter os dois passos do mockup
  (`Minhas Vendas - Clássico (offline).html`).
