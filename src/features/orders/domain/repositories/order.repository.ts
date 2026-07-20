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

export interface CreateOrderItemParams {
  productId: number;
  m2: number;
  pricePerM2: number;
  commissionRatePercent: number;
}

export interface CreateOrderParams {
  carpenterId: number;
  items: CreateOrderItemParams[];
}

export interface CreateOrderResult {
  id: number;
}

export interface OrderRepository {
  list(params: OrderListParams): Promise<OrderListResult>;
  create(params: CreateOrderParams): Promise<CreateOrderResult>;
}
