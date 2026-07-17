export interface OrderProductLine {
  productId: number;
  productName: string;
  valueFormatted: string;
  percentFormatted: string;
}

/** GET /pedidos só devolve valor/porcentagem como string formatada — sem campo numérico nem de comissão nessa rota (ver TODO.md). */
export interface Order {
  id: number;
  code: string;
  valueFormatted: string;
  carpenterId: number;
  carpenterName: string;
  products: OrderProductLine[];
}
