import { useNavigate } from 'react-router-dom';
import { DashboardSummary, OnboardingCard, colors, fontSize, fontWeight, spacing } from 'minhas-venda-design-system';
import type { DashboardContainer } from '../../dashboard.container';
import { useDashboard } from '../hooks/use-dashboard.hook';

export interface DashboardPageProps {
  dashboardContainer: DashboardContainer;
  userName: string;
}

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardPage({ dashboardContainer, userName }: DashboardPageProps) {
  const navigate = useNavigate();
  const { summary, loading, error } = useDashboard(dashboardContainer);

  if (loading) return <div>Carregando…</div>;
  if (error) return <div>{error}</div>;
  if (!summary) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[24] }}>
      <h2 style={{ margin: 0, fontSize: fontSize[22], fontWeight: fontWeight.bold, color: colors.text.primary }}>
        {greetingForHour(new Date().getHours())}, {userName}
      </h2>

      {summary.needsOnboarding && (
        <OnboardingCard
          title="Vamos começar!"
          description="Antes do primeiro pedido, cadastre uma chapa de MDF."
          actions={[{ label: 'Adicionar chapa', onClick: () => navigate('/products') }]}
        />
      )}

      <DashboardSummary
        totalVendidoFmt="Indisponível"
        totalComissaoFmt="Indisponível"
        onRegistrarPedido={() => navigate('/orders/new')}
        onVerTodos={() => navigate('/orders')}
        recentPedidos={summary.recentOrders.map((order) => ({
          id: order.id,
          cliente: order.carpenterName,
          produtoNome: order.productNames,
          dataFmt: order.dateFormatted,
          valorFmt: order.valueFormatted,
          comissaoFmt: order.commissionFormatted,
        }))}
      />
    </div>
  );
}
