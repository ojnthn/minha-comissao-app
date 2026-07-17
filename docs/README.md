# docs/ — guia de camadas pra IA e devs

Este diretório não repete o que já está em `CLAUDE.md` e `ARCHITECTURE.md` na
raiz do repo (visão de produto, stack, regras de negócio, contrato de API,
tabela de nomenclatura, mapa de tradução de domínio). Aqui o foco é **como
implementar cada camada** quando for construir ou alterar uma feature —
responsabilidades, o que pode e o que não pode fazer, com exemplos.

Ordem de leitura recomendada antes de tocar em código:

1. `CLAUDE.md` (raiz) — visão de produto, stack, regras que já causam bug.
2. `ARCHITECTURE.md` (raiz) — estrutura de pastas, tabela de sufixos, mapa
   de tradução PT/EN, roteamento, cálculo de negócio, auth.
3. Este `docs/` — regras de implementação por camada.

## Índice

- [layers/domain.md](layers/domain.md) — entities, repositories (interface), usecases.
- [layers/data.md](layers/data.md) — dto, datasources, repositories (impl).
- [layers/presentation.md](layers/presentation.md) — pages, hooks.
- [layers/container.md](layers/container.md) — `<feature>.container.ts` (DI local).
- [new-feature-guide.md](new-feature-guide.md) — checklist passo a passo pra criar uma feature nova reproduzindo o scaffold já pronto em `src/features/`.

## Regra de ouro (vale pra toda camada)

```
domain            <-- não importa nada de fora dela mesma
  ^ implementa a interface
data              <-- implementa as portas do domain, fala com a API
  ^ é chamado via container (DI)
presentation      <-- só conhece domain (tipos/usecases) via container.ts
```

- Nunca importar `data/` direto de `presentation/` — sempre via `<feature>.container.ts`.
- Nunca importar uma feature de dentro de outra — o compartilhado sobe pra
  `shared/`; composição entre features acontece em `app/`.
- Em caso de dúvida sobre contrato de API ou prop de componente do
  design-system: **reportar a divergência, nunca assumir**.
