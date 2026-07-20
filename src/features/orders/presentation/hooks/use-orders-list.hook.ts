import { useEffect, useState } from 'react';
import type { Order } from '../../domain/entities/order.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';
import type { ordersContainer } from '../../orders.container';

const PAGE_SIZE = 10;

export function useOrdersList(orders: Pick<typeof ordersContainer, 'listOrders'>) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OffsetPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    orders
      .listOrders({ page, limit: PAGE_SIZE, order: 'mais-novo' })
      .then((result) => {
        if (!active) return;
        setItems(result.orders);
        setPagination(result.pagination);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar os pedidos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orders, page]);

  const hasNextPage = !!pagination && pagination.next !== null && pagination.next !== pagination.current;
  const hasPreviousPage = page > 1;

  return {
    orders: items,
    loading,
    error,
    page,
    hasNextPage,
    hasPreviousPage,
    goToNextPage: () => hasNextPage && setPage((current) => current + 1),
    goToPreviousPage: () => hasPreviousPage && setPage((current) => current - 1),
  };
}
