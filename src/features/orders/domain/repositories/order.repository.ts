import type { Order } from '../entities/order.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';

export type OrderListOrder = 'mais-antigo' | 'mais-novo';

export interface OrderListParams {
  page: number;
  limit: number;
  carpenterId?: number;
  onlyOwn?: boolean;
  dateFrom?: string;
  dateTo?: string;
  order?: OrderListOrder;
}

export interface OrderListResult {
  orders: Order[];
  pagination: OffsetPagination;
}

export interface OrderRepository {
  list(params: OrderListParams): Promise<OrderListResult>;
}
