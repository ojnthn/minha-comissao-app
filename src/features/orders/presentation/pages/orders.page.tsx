import { Button, DataTable, colors, fontSize, fontWeight, spacing, type DataTableColumn } from '@ojnthn/minhas-venda-design-system';
import type { Order } from '../../domain/entities/order.entity';
import { ordersContainer } from '../../orders.container';
import { useOrdersList } from '../hooks/use-orders-list.hook';

const columns: DataTableColumn<Order>[] = [
  { key: 'code', header: 'Código', render: (order) => order.code },
  { key: 'date', header: 'Data', render: (order) => order.dateFormatted },
  { key: 'carpenter', header: 'Marceneiro', render: (order) => order.carpenterName },
  { key: 'products', header: 'Produtos', render: (order) => order.products.map((product) => product.productName).join(', ') },
  { key: 'value', header: 'Valor', render: (order) => order.valueFormatted, align: 'right' },
  { key: 'commission', header: 'Comissão', render: (order) => order.commissionFormatted, align: 'right' },
];

export function OrdersPage() {
  const { orders, loading, error, page, hasNextPage, hasPreviousPage, goToNextPage, goToPreviousPage } =
    useOrdersList(ordersContainer);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[18] }}>
      <DataTable
        aria-label="Meus pedidos"
        columns={columns}
        data={orders}
        rowKey={(order) => String(order.id)}
        isLoading={loading}
        emptyMessage="Nenhum pedido registrado ainda."
      />

      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[12] }}>
          <span style={{ fontSize: fontSize[14], fontWeight: fontWeight.bold, color: colors.text.dim }}>
            Página {page}
          </span>
          <Button variant="secondary" size="md" disabled={!hasPreviousPage} onClick={goToPreviousPage}>
            Anterior
          </Button>
          <Button variant="secondary" size="md" disabled={!hasNextPage} onClick={goToNextPage}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
