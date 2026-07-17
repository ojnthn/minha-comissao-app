import { useEffect, useState } from 'react';
import type { DashboardSummary } from '../../domain/usecases/get-dashboard-summary.usecase';
import type { DashboardContainer } from '../../dashboard.container';

export function useDashboard(dashboardContainer: DashboardContainer) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    dashboardContainer
      .getDashboardSummary()
      .then((result) => {
        if (active) setSummary(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar o resumo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dashboardContainer]);

  return { summary, loading, error };
}
