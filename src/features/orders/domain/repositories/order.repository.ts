import type { Order } from '../entities/order.entity';
import type { RepeatingPagination } from '../../../../shared/types/pagination';

export interface OrderListParams {
  page: number;
  limit: number;
}

export interface OrderListResult {
  orders: Order[];
  pagination: RepeatingPagination;
}

export interface OrderRepository {
  list(params: OrderListParams): Promise<OrderListResult>;
}
