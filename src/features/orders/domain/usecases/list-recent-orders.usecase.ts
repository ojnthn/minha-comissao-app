import type { OrderRepository } from '../repositories/order.repository';
import type { Order } from '../entities/order.entity';

/** API não tem parâmetro de ordenação nem endpoint de "recentes" (ver TODO.md) — busca tudo e pega os últimos N por id. */
export function createListRecentOrdersUseCase(orderRepository: OrderRepository) {
  return async (limit = 5): Promise<Order[]> => {
    const first = await orderRepository.list({ page: 1, limit: 1 });
    const total = first.pagination.total ?? 0;
    if (total === 0) return [];

    const all = await orderRepository.list({ page: 1, limit: total });
    return all.orders.slice(-limit).reverse();
  };
}
