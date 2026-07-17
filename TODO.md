# TODO — gaps entre a API real e o que a home/dashboard precisaria

Levantado ao implementar a feature de home (`dashboard`). Ver `CLAUDE.md`
seção 3/4 e `docs/new-feature-guide.md` — regra do projeto é reportar
divergência de contrato, nunca assumir/inventar endpoint ou campo.

## Backend (`minha-venda-foundation`)

- [ ] **Sem endpoint de agregados do dashboard.** `GET /pedidos` devolve
  `valor` e `produtos[].porcentagem`/`valor` já formatados como string
  (`"R$ 1.500,00"`, `"10%"`) — não existe campo numérico, nem campo de
  comissão em lugar nenhum da resposta. Não dá pra calcular "vendido este
  mês" / "comissão este mês" (com tendência vs. mês anterior) no frontend
  sem um endpoint que devolva números crus ou já agregados. Enquanto isso
  não existe, os dois `StatCard` da home mostram `"Indisponível"` como
  placeholder (`src/features/dashboard/presentation/pages/dashboard.page.tsx`).
- [ ] **`GET /pedidos` não devolve data do pedido.** O filtro
  `dataInicio`/`dataFim` existe na query, mas o item da lista
  (`ListPedidosOutput.data[]`) não inclui `logDataCadastro` nem nenhum
  campo de data. Bloqueia mostrar "há quanto tempo" e também bloqueia
  filtrar/agrupar por mês no frontend. Hoje `dataFmt` no card de pedido
  recente da home é só `"—"`.
- [ ] **Sem parâmetro de ordenação em `GET /pedidos`.** Pra montar
  "pedidos recentes" na home, o usecase
  (`src/features/orders/domain/usecases/list-recent-orders.usecase.ts`)
  precisa fazer 2 chamadas HTTP (uma pra descobrir `total`, outra buscando
  tudo com `limit=total`) e cortar os últimos N no cliente, porque a API
  sempre ordena por `id asc` sem opção de inverter. Um `sort=desc` ou um
  endpoint dedicado tipo `GET /pedidos/recentes` resolveria melhor e mais
  barato.
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

- [ ] Quando os itens de agregado/data acima existirem no backend, trocar
  o placeholder `"Indisponível"` dos `StatCard` por valor real +
  `TrendIndicator`, e trocar `dataFmt`/`comissaoFmt` (hoje `"—"`) nos
  pedidos recentes.
- [ ] Quando `ComissaoPorcentagem` tiver endpoint de leitura, atualizar
  `needsOnboarding` (hoje só `!hasProducts`) pra também checar percentual,
  e o `OnboardingCard` da home pra voltar a ter os dois passos do mockup
  (`Minhas Vendas - Clássico (offline).html`).
