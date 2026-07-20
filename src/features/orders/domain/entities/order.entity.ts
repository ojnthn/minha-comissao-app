export interface OrderProductLine {
  productId: number;
  productName: string;
  valueFormatted: string;
  percentFormatted: string;
}

/** `valueFormatted`/`commissionFormatted` vêm formatados (BRL) da API — nunca usar como fonte numérica pra cálculo (ver CLAUDE.md seção 4). */
export interface Order {
  id: number;
  code: string;
  dateFormatted: string;
  valueFormatted: string;
  commissionFormatted: string;
  carpenterId: number;
  carpenterName: string;
  sellerId: number;
  sellerName: string;
  products: OrderProductLine[];
}

/** Um item do pedido em construção (ainda não salvo) — estado bruto, nunca formatado. */
export interface OrderItemDraft {
  productId: number;
  productName: string;
  m2: number;
  pricePerM2: number;
  commissionRateId: number;
  commissionRateLabel: string;
  commissionRatePercent: number;
}

export function calculateOrderItemValue(item: Pick<OrderItemDraft, 'm2' | 'pricePerM2'>): number {
  return item.m2 * item.pricePerM2;
}

export function calculateOrderItemCommission(
  item: Pick<OrderItemDraft, 'm2' | 'pricePerM2' | 'commissionRatePercent'>,
): number {
  return calculateOrderItemValue(item) * (item.commissionRatePercent / 100);
}

export interface OrderTotals {
  value: number;
  commission: number;
}

export function calculateOrderTotals(
  items: Pick<OrderItemDraft, 'm2' | 'pricePerM2' | 'commissionRatePercent'>[],
): OrderTotals {
  return items.reduce<OrderTotals>(
    (totals, item) => ({
      value: totals.value + calculateOrderItemValue(item),
      commission: totals.commission + calculateOrderItemCommission(item),
    }),
    { value: 0, commission: 0 },
  );
}
