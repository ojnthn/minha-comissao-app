import type { DashboardDataPort, DashboardRecentOrder } from '../repositories/dashboard.repository';

export interface DashboardSummary {
  recentOrders: DashboardRecentOrder[];
  needsOnboarding: boolean;
}

export function createGetDashboardSummaryUseCase(port: DashboardDataPort) {
  return async (): Promise<DashboardSummary> => {
    const [recentOrders, hasProducts] = await Promise.all([port.listRecentOrders(), port.hasProducts()]);
    return { recentOrders, needsOnboarding: !hasProducts };
  };
}
