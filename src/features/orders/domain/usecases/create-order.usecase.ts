import type { OrderRepository, CreateOrderParams, CreateOrderResult } from '../repositories/order.repository';

export function createCreateOrderUseCase(orderRepository: OrderRepository) {
  return async (params: CreateOrderParams): Promise<CreateOrderResult> => {
    if (params.items.length === 0) {
      throw new Error('Pedido deve ter ao menos um produto');
    }
    return orderRepository.create(params);
  };
}
