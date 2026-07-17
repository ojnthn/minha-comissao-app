import { ordersContainer } from '../features/orders/orders.container';
import { productsContainer } from '../features/products/products.container';
import { createDashboardContainer } from '../features/dashboard/dashboard.container';

/**
 * Composição entre features (orders + products -> dashboard) — só acontece
 * aqui em app/, nunca container->container (ver docs/layers/container.md).
 */
export const dashboardContainer = createDashboardContainer({
  listRecentOrders: async () => {
    const orders = await ordersContainer.listRecentOrders();
    return orders.map((order) => ({
      id: String(order.id),
      carpenterName: order.carpenterName,
      productNames: order.products.map((product) => product.productName).join(', '),
      valueFormatted: order.valueFormatted,
    }));
  },
  hasProducts: productsContainer.hasProducts,
});
