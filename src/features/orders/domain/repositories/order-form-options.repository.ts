import type { RepeatingPagination, OffsetPagination } from '../../../../shared/types/pagination';

export interface OrderFormCarpenterOption {
  id: number;
  name: string;
}

export interface OrderFormProductOption {
  id: number;
  name: string;
  pricePerM2: number;
  defaultCommissionRateId: number;
}

export interface OrderFormCommissionRateOption {
  id: number;
  label: string;
  percent: number;
}

export interface OrderFormCarpenterSearchParams {
  page: number;
  limit: number;
  search?: string;
}

export interface OrderFormCarpenterSearchResult {
  carpenters: OrderFormCarpenterOption[];
  pagination: RepeatingPagination;
}

export interface OrderFormListParams {
  page: number;
  limit: number;
}

export interface OrderFormProductListResult {
  products: OrderFormProductOption[];
  pagination: OffsetPagination;
}

export interface OrderFormCommissionRateListResult {
  commissionRates: OrderFormCommissionRateOption[];
  pagination: OffsetPagination;
}

/**
 * Port: a tela de novo pedido precisa de marceneiro/produto/percentual pra popular os
 * seletores, mas `orders` não pode importar `carpenters`/`products` diretamente (ver
 * CLAUDE.md seção 3). A implementação real é montada em `app/new-order.composition.ts` —
 * nunca importar as features de origem aqui nem em `orders.container.ts`.
 */
export interface OrderFormOptionsPort {
  searchCarpenters(params: OrderFormCarpenterSearchParams): Promise<OrderFormCarpenterSearchResult>;
  listProducts(params: OrderFormListParams): Promise<OrderFormProductListResult>;
  listCommissionRates(params: OrderFormListParams): Promise<OrderFormCommissionRateListResult>;
}
