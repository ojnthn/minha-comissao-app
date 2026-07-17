# Checklist — criar/completar uma feature

O scaffold de pastas de todas as features (`orders`, `products`,
`carpenters`, `dashboard`, `auth`) já existe em
`src/features/<feature>/` com `domain/`, `data/`, `presentation/` e
`<feature>.container.ts` vazios (ou com página placeholder, quando a rota
já existe em `app/routes.tsx`). Pra implementar a feature de verdade:

1. **Confirme o contrato real da API** no `minha-venda-foundation` (rota,
   método, shape de request/response, se exige JWT, shape de paginação) —
   nunca assumir a partir do nome do campo. Se documentação e código
   divergirem, reportar antes de codar (regra herdada, `CLAUDE.md` seção 3).
2. **`domain/entities/<nome>.entity.ts`** — defina o tipo em inglês e
   qualquer função pura de cálculo/validação. Ver [layers/domain.md](layers/domain.md).
3. **`domain/repositories/<nome>.repository.ts`** — interface com os
   métodos que a feature precisa (`list`, `create`, `update`, `delete`...),
   assinatura em termos de entidade de domínio.
4. **`domain/usecases/<ação>-<nome>.usecase.ts`** — uma função por operação
   de negócio, recebendo a interface do repository por parâmetro.
5. **`data/models/<nome>.dto.ts`** — replique o JSON real da API,
   campos em português, sem "consertar" nome de campo.
6. **`data/datasources/<nome>-http.datasource.ts`** — chamada crua via
   `shared/http/http-client.ts` (`httpClient.get/post/patch/delete`),
   retornando o DTO.
7. **`data/repositories/<nome>.repository.impl.ts`** — implemente a
   interface do passo 3, traduzindo DTO → entidade (mapa de tradução em
   `ARCHITECTURE.md` seção 2).
8. **`<feature>.container.ts`** — monte datasource → repository → usecases,
   exporte um objeto único.
9. **`presentation/hooks/use-<nome>.hook.ts`** — consuma só o container do
   passo 8, guarde dado bruto em estado.
10. **`presentation/pages/<nome>.page.tsx`** — use o hook, derive `*Fmt` com
    `Intl.NumberFormat`/`Intl.DateTimeFormat` na hora de montar as props do
    componente do `minhas-venda-design-system` correspondente (checar
    prop-a-prop no repo `minha-venda-design-system`, não assumir pelo nome).
11. **`app/routes.tsx`** — se for uma tela nova (não é o caso das 5 já
    mapeadas), adicione o path e o mapeamento pro `SidebarScreen` correto.
    Esse arquivo é o único que importa páginas de todas as features.
12. **Rode `pnpm lint` e `pnpm typecheck`/`pnpm build`** antes de considerar
    a tela pronta (regra herdada do design-system, `ARCHITECTURE.md` seção 10).

## Antes de abrir mão do scaffold

Se a feature genuinamente não tem endpoint no backend ainda (caso real
hoje: `commission-rates` / `ComissaoPorcentagem` não tem CRUD exposto no
foundation), não invente rota nem mock silencioso — reporte o bloqueio e
decida com o time/usuário como tratar a camada `data/` enquanto isso (ver
`CLAUDE.md` seção 3, regra "nunca inventar endpoints/campos que a API do
foundation não expõe").
