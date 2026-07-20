import { carpentersContainer } from '../features/carpenters/carpenters.container';
import { productsContainer } from '../features/products/products.container';
import type { OrderFormOptionsPort } from '../features/orders/domain/repositories/order-form-options.repository';

/**
 * Composição entre features (carpenters + products -> orders) — só acontece aqui em
 * app/, nunca container->container (ver docs/layers/container.md, mesmo padrão de
 * app/dashboard.composition.ts).
 */
export const orderFormOptions: OrderFormOptionsPort = {
  searchCarpenters: async ({ page, limit, search }) => {
    const result = await carpentersContainer.listCarpenters({ page, limit, nome: search });
    return {
      carpenters: result.carpenters.map((carpenter) => ({ id: carpenter.id, name: carpenter.name })),
      pagination: result.pagination,
    };
  },
  listProducts: async ({ page, limit }) => {
    const result = await productsContainer.listProducts({ page, limit });
    return {
      products: result.products.map((product) => ({
        id: product.id,
        name: product.name,
        pricePerM2: product.pricePerM2,
        defaultCommissionRateId: product.defaultCommissionRateId,
      })),
      pagination: result.pagination,
    };
  },
  listCommissionRates: async ({ page, limit }) => {
    const result = await productsContainer.listCommissionRates({ page, limit });
    return {
      commissionRates: result.commissionRates.map((rate) => ({ id: rate.id, label: rate.name, percent: rate.value })),
      pagination: result.pagination,
    };
  },
};
