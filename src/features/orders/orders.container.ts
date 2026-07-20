import { createOrderRepository } from './data/repositories/order.repository.impl';
import { createListRecentOrdersUseCase } from './domain/usecases/list-recent-orders.usecase';
import { createListOrdersUseCase } from './domain/usecases/list-orders.usecase';

const orderRepository = createOrderRepository();

export const ordersContainer = {
  listRecentOrders: createListRecentOrdersUseCase(orderRepository),
  listOrders: createListOrdersUseCase(orderRepository),
};
