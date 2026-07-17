# Camada `domain/`

`src/features/<feature>/domain/{entities,repositories,usecases}/`

## Responsabilidade

Regra de negócio pura da feature, sem I/O. É a camada mais interna — nada
fora dela mesma é importado aqui.

- `entities/<nome>.entity.ts` — tipo de domínio (em inglês) + funções puras
  de cálculo/validação sobre esse tipo. Ex.: `order.entity.ts` expõe
  `Order` e a função que calcula `orderValue`/`orderCommission` a partir de
  `m2`/`pricePerM2`/`commissionRate` (ver `ARCHITECTURE.md` seção 6).
- `repositories/<nome>.repository.ts` — **interface** (porta) que descreve o
  que a feature precisa buscar/persistir, em termos de domínio (entidade,
  não DTO). Ex.: `listOrders(): Promise<Order[]>`.
- `usecases/<ação>-<nome>.usecase.ts` — orquestra uma operação de negócio
  chamando a interface do repository (recebida por injeção, nunca
  instanciada aqui). Concentra validação que depende de mais de um dado
  (ex.: "order precisa de ao menos um product").

## Pode

- Definir tipos, interfaces e funções puras.
- Importar de `shared/` (tipos que cruzam features de verdade).
- Depender de outra interface `*.repository.ts` da **mesma** feature.

## Não pode

- Importar de `data/` ou `presentation/` da própria feature ou de qualquer
  outra feature.
- Fazer `fetch`, acessar `sessionStorage`, formatar string
  (`Intl.NumberFormat`/`Intl.DateTimeFormat`) — isso é responsabilidade de
  `data/` (fonte crua) ou `presentation/pages` (formatação pra UI).
- Conhecer o shape do DTO/JSON da API (campos em português). O domain só
  conhece a entidade traduzida (`Order`, `Product`, `CommissionRate`,
  `Carpenter` — ver mapa de tradução em `ARCHITECTURE.md` seção 2).
- Instanciar diretamente uma implementação de repository — sempre recebe a
  interface via parâmetro/injeção, resolvida pelo `<feature>.container.ts`.

## Exemplo mínimo

```ts
// domain/entities/order.entity.ts
export interface Order {
  id: string;
  clientName: string;
  m2: number;
  pricePerM2: number;
  commissionRatePercent: number;
}

export function calculateOrderValue(order: Pick<Order, 'm2' | 'pricePerM2'>): number {
  return order.m2 * order.pricePerM2;
}

export function calculateOrderCommission(order: Order): number {
  return calculateOrderValue(order) * (order.commissionRatePercent / 100);
}
```

```ts
// domain/repositories/order.repository.ts
import type { Order } from '../entities/order.entity';

export interface OrderRepository {
  list(): Promise<Order[]>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
}
```

```ts
// domain/usecases/list-orders.usecase.ts
import type { OrderRepository } from '../repositories/order.repository';

export function createListOrdersUseCase(orderRepository: OrderRepository) {
  return () => orderRepository.list();
}
```
