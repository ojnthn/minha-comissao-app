import type { OrderRepository } from '../repositories/order.repository';
import type { Order } from '../entities/order.entity';

export function createListRecentOrdersUseCase(orderRepository: OrderRepository) {
  return async (limit = 5): Promise<Order[]> => {
    const result = await orderRepository.list({ page: 1, limit, order: 'mais-novo' });
    return result.orders;
  };
}
