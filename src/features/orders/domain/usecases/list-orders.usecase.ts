import type { OrderRepository, OrderListParams, OrderListResult } from '../repositories/order.repository';

export function createListOrdersUseCase(orderRepository: OrderRepository) {
  return async (params: OrderListParams): Promise<OrderListResult> => {
    return orderRepository.list(params);
  };
}
