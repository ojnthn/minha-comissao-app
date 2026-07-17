# minha-comissao-app

App "Minha Comissão" — React 19 + TypeScript + Vite. Ver `CLAUDE.md` e
`ARCHITECTURE.md` na raiz pra visão de produto, stack e regras de
arquitetura; `docs/` pra guia de implementação por camada.

## Setup

```bash
pnpm install
cp .env.example .env   # ajustar VITE_API_URL se necessário
pnpm dev
```

## Scripts

```bash
pnpm dev        # servidor de desenvolvimento
pnpm build      # typecheck (tsc -b) + build de produção
pnpm lint       # oxlint
pnpm preview    # preview do build
```
