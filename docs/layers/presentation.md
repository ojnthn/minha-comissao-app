# Camada `presentation/`

`src/features/<feature>/presentation/{pages,hooks}/`

## Responsabilidade

Renderiza componentes do `minhas-venda-design-system` (o import real do
pacote — cuidado, `CLAUDE.md`/`ARCHITECTURE.md` ainda citam o nome antigo
`@mdf/design-system`, que não bate com o `package.json`; reportado, não
corrigir silenciosamente sem confirmar) e conecta a entrada do usuário aos
usecases da feature.

- `hooks/use-<nome>.hook.ts` — chama usecase(s) via
  `<feature>.container.ts`, guarda o dado bruto (entidade de domínio, já em
  inglês) em estado, calcula campos derivados com `useMemo`
  (ex.: `isValid`, `orderValue`).
- `pages/<nome>.page.tsx` — usa o hook, deriva as props `*Fmt`
  (`Intl.NumberFormat`/`Intl.DateTimeFormat`) só aqui, na hora de montar as
  props do componente do design-system, e renderiza o organism/template.

## Pode

- Importar `domain/` (tipos e usecases) só através de
  `<feature>.container.ts` — nunca `domain/usecases/*.usecase.ts` direto,
  nunca `data/` de jeito nenhum.
- Importar componentes de `minhas-venda-design-system`.
- Formatar dado bruto pra string (`*Fmt`) exclusivamente em `*.page.tsx`.

## Não pode

- Guardar a versão formatada (`*Fmt`) no estado do hook — o hook guarda
  sempre o dado bruto; formatação é derivada, recalculada a cada render.
- Importar `data/` (datasource ou `.repository.impl.ts`) diretamente.
- Importar página/hook de outra feature. Se duas features precisarem se
  compor (ex.: `orders` usa `carpenters` como seletor), a composição
  acontece via `app/routes.tsx` ou passando dados já resolvidos por prop —
  nunca um `import` cruzado entre `features/*`.
- Duplicar visual do design-system (recriar um card, um input estilizado
  na mão). Se falta componente/variante, a mudança é no repo
  `minha-venda-design-system`, não aqui.
- Hardcodar cor/espaçamento/raio — sempre vem de token do design-system.

## Exemplo mínimo

```ts
// presentation/hooks/use-orders.hook.ts
import { useEffect, useState } from 'react';
import type { Order } from '../../domain/entities/order.entity';
import { ordersContainer } from '../../orders.container';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    ordersContainer.listOrders().then(setOrders);
  }, []);

  return { orders };
}
```

```tsx
// presentation/pages/orders.page.tsx
import { PedidosList } from 'minhas-venda-design-system';
import { useOrders } from '../hooks/use-orders.hook';

export function OrdersPage() {
  const { orders } = useOrders();

  const pedidos = orders.map((order) => ({
    id: order.id,
    cliente: order.clientName,
    produtoNome: order.productName,
    dataFmt: new Intl.DateTimeFormat('pt-BR').format(order.date),
    m2Fmt: `${order.m2} m²`,
    valorFmt: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.value),
    percentualFmt: `${order.commissionRatePercent}%`,
    comissaoFmt: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.commission),
    onEdit: () => {},
    onDelete: () => {},
  }));

  return <PedidosList filtroMes="" mesesDisponiveis={[]} onFiltroMesChange={() => {}} pedidos={pedidos} />;
}
```
