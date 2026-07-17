# `<feature>.container.ts` — DI local

`src/features/<feature>/<feature>.container.ts`

## Responsabilidade

Único ponto de montagem da feature: instancia datasource → repository →
usecases, e exporta pro `presentation/` consumir. É o único arquivo, além
de `app/routes.tsx`, que tem permissão de enxergar `data/` e `domain/` ao
mesmo tempo.

## Pode

- Importar de `data/` (datasource, `.repository.impl.ts`) e de `domain/`
  (interfaces, usecases) da mesma feature.
- Ler config vinda de fora (ex.: `configureHttpClient` do `shared/http`,
  chamada pelo `auth.container.ts` — ver `ARCHITECTURE.md` seção 7).

## Não pode

- Ser importado por `data/` ou `domain/` (só `presentation/` e `app/`
  importam o container).
- Conter regra de negócio — isso é do `usecase`. O container só monta o
  grafo de dependência.
- Importar container de outra feature. Composição entre features acontece
  em `app/`, não container→container.

## Exemplo mínimo

```ts
// orders.container.ts
import { createOrderRepository } from './data/repositories/order.repository.impl';
import { createListOrdersUseCase } from './domain/usecases/list-orders.usecase';
import { createCreateOrderUseCase } from './domain/usecases/create-order.usecase';

const orderRepository = createOrderRepository();

export const ordersContainer = {
  listOrders: createListOrdersUseCase(orderRepository),
  createOrder: createCreateOrderUseCase(orderRepository),
};
```

`presentation/hooks/*.hook.ts` importa só `ordersContainer`, nunca
`order.repository.impl.ts` nem `list-orders.usecase.ts` diretamente.
