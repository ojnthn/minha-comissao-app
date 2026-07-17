import { useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShellTemplate, type SidebarScreen } from 'minhas-venda-design-system';
import { DashboardPage } from '../features/dashboard/presentation/pages/dashboard.page';
import { NewOrderPage } from '../features/orders/presentation/pages/new-order.page';
import { OrdersPage } from '../features/orders/presentation/pages/orders.page';
import { ProductsPage } from '../features/products/presentation/pages/products.page';
import { CommissionRatesPage } from '../features/commission-rates/presentation/pages/commission-rates.page';
import { LoginPage } from '../features/auth/presentation/pages/login.page';
import { authContainer } from '../features/auth/auth.container';

/**
 * Única fonte de verdade path <-> screen (Sidebar.activeScreen).
 * `screen` é valor fixo do design-system — path é o que muda.
 */
const SCREEN_BY_PATH: Record<string, SidebarScreen> = {
  '/': 'dashboard',
  '/orders/new': 'novo',
  '/orders': 'pedidos',
  '/products': 'produtos',
  '/commission-rates': 'percentuais',
};

const PATH_BY_SCREEN: Record<SidebarScreen, string> = {
  dashboard: '/',
  novo: '/orders/new',
  pedidos: '/orders',
  produtos: '/products',
  percentuais: '/commission-rates',
};

const TITLE_BY_SCREEN: Record<SidebarScreen, string> = {
  dashboard: 'Resumo',
  novo: 'Novo Pedido',
  pedidos: 'Meus Pedidos',
  produtos: 'Minhas Chapas',
  percentuais: 'Comissões',
};

function screenForPath(pathname: string): SidebarScreen {
  return SCREEN_BY_PATH[pathname] ?? 'dashboard';
}

function ShellLayout({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const activeScreen = screenForPath(location.pathname);

  if (!authContainer.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShellTemplate
      sidebar={{
        expanded,
        activeScreen,
        onNavigate: (screen) => navigate(PATH_BY_SCREEN[screen]),
        onToggleExpanded: () => setExpanded((current) => !current),
      }}
      title={TITLE_BY_SCREEN[activeScreen]}
    >
      {children}
    </AppShellTemplate>
  );
}

export function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={() => navigate('/', { replace: true })} />} />
      <Route
        path="/*"
        element={
          <ShellLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/new" element={<NewOrderPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/commission-rates" element={<CommissionRatesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ShellLayout>
        }
      />
    </Routes>
  );
}
