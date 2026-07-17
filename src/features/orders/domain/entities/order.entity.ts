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
