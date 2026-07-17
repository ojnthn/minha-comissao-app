export interface DashboardRecentOrder {
  id: string;
  carpenterName: string;
  productNames: string;
  dateFormatted: string;
  valueFormatted: string;
  commissionFormatted: string;
}

/**
 * Port: dashboard não fala com API própria, agrega dados de orders/products.
 * A implementação real é montada em app/dashboard.composition.ts — nunca
 * importar orders/products diretamente aqui nem no container desta feature.
 */
export interface DashboardDataPort {
  listRecentOrders(): Promise<DashboardRecentOrder[]>;
  hasProducts(): Promise<boolean>;
}
