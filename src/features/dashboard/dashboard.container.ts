import { createGetDashboardSummaryUseCase } from './domain/usecases/get-dashboard-summary.usecase';
import type { DashboardDataPort } from './domain/repositories/dashboard.repository';

/**
 * Fábrica, não instância pronta: o port (dados de orders/products) só existe
 * depois da composição entre features em app/dashboard.composition.ts.
 */
export function createDashboardContainer(port: DashboardDataPort) {
  return {
    getDashboardSummary: createGetDashboardSummaryUseCase(port),
  };
}

export type DashboardContainer = ReturnType<typeof createDashboardContainer>;
