/** Produto real não tem campo de preço (ver TODO.md) — valor por item é digitado direto na criação do pedido. */
export interface Product {
  id: number;
  name: string;
  defaultCommissionRateId: number;
}
