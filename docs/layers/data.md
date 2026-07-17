# Camada `data/`

`src/features/<feature>/data/{models,datasources,repositories}/`

## Responsabilidade

Fala com o mundo externo (API do foundation) e traduz pra linguagem do
domain. É a fronteira entre o contrato real do backend (português) e a
entidade de domínio (inglês).

- `models/<nome>.dto.ts` — tipo que espelha **exatamente** o JSON da API,
  campos em português (`idProduto`, `valorPorcentagem`, `idMarceneiro`...).
  Nunca renomear campo de DTO pra "traduzir" — o DTO existe pra isolar essa
  diferença. Ver `ARCHITECTURE.md` seção 2 pro mapa de tradução completo.
- `datasources/<nome>-http.datasource.ts` — chamada crua via
  `shared/http/http-client.ts`. Sem regra de negócio, sem tradução — só
  monta a request e retorna o DTO tal como a API responde.
- `repositories/<nome>.repository.impl.ts` — implementa a interface de
  `domain/repositories/<nome>.repository.ts`; chama o datasource e faz o
  mapeamento DTO (PT) → entidade de domínio (EN). **É aqui, e só aqui, que
  a tradução de campo acontece.**

## Pode

- Importar `shared/http/http-client.ts` e `shared/types/pagination.ts`.
- Importar a interface (não a implementação) de `domain/repositories/` da
  mesma feature, pra garantir que a impl satisfaz o contrato.
- Fazer o mapeamento de paginação (`OffsetPagination` vs
  `RepeatingPagination` — nunca tratar as duas como iguais; ver
  `ARCHITECTURE.md` seção 5 e `CLAUDE.md` seção 4 pra qual endpoint usa qual
  shape, incluindo casos com nomes de chave diferentes, ex. `paginacao`/`detalhes`
  em vez de `pagination`/`data` — sempre verificar o endpoint real antes de
  assumir).

## Não pode

- Vazar o DTO (campos em português) pra fora do `.repository.impl.ts` — quem
  chama (usecase/hook) só vê a entidade traduzida.
- Formatar valor pra exibição (`R$`, `%`, data) — o `GET /pedidos` já
  devolve `valor`/`porcentagem` como string formatada, mas isso **não** é
  fonte de valor numérico pra cálculo; o valor numérico é o que foi
  enviado no create/update, guardado no estado local (ver `CLAUDE.md`
  seção 4).
- Inventar campo ou endpoint que a API não expõe. Se a regra de conversão
  não estiver clara (ex.: `m2` → `valorProduto`), reportar a divergência,
  não assumir uma fórmula.
- Importar `presentation/` — a direção da dependência é sempre
  `presentation → domain ← data`, nunca `data → presentation`.

## Exemplo mínimo

```ts
// data/models/order.dto.ts
export interface OrderDto {
  id: number;
  valor: number;
  idMarceneiro: number;
  produtos: number[];
}
```

```ts
// data/datasources/order-http.datasource.ts
import { httpClient } from '../../../../shared/http/http-client';
import type { OrderDto } from '../models/order.dto';

export function createOrderHttpDatasource() {
  return {
    create: (body: { valor: number; idMarceneiro: number; produtos: unknown[] }) =>
      httpClient.post<OrderDto>('/pedidos', body),
  };
}
```

```ts
// data/repositories/order.repository.impl.ts
import type { OrderRepository } from '../../domain/repositories/order.repository';
import type { Order } from '../../domain/entities/order.entity';
import { createOrderHttpDatasource } from '../datasources/order-http.datasource';

export function createOrderRepository(): OrderRepository {
  const datasource = createOrderHttpDatasource();
  return {
    async create(order) {
      const dto = await datasource.create({
        valor: order.m2 * order.pricePerM2,
        idMarceneiro: Number(order.carpenterId),
        produtos: [], // preencher conforme contrato real de /pedidos
      });
      return { id: String(dto.id), ...order };
    },
    async list() {
      throw new Error('not implemented');
    },
  };
}
```
