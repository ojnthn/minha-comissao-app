import { useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShellTemplate, type SidebarScreen } from 'minhas-venda-design-system';
import { useTheme } from '../shared/hooks/use-theme.hook';
import { DashboardPage } from '../features/dashboard/presentation/pages/dashboard.page';
import { NewOrderPage } from '../features/orders/presentation/pages/new-order.page';
import { OrdersPage } from '../features/orders/presentation/pages/orders.page';
import { ProductsPage } from '../features/products/presentation/pages/products.page';
import { LoginPage } from '../features/auth/presentation/pages/login.page';
import { authContainer } from '../features/auth/auth.container';
import { useCurrentUser } from '../features/auth/presentation/hooks/use-current-user.hook';
import { getInitials } from '../features/auth/domain/entities/session.entity';
import { dashboardContainer } from './dashboard.composition';

/**
 * Única fonte de verdade path <-> screen (Sidebar.activeScreen).
 * `screen` é valor fixo do design-system — path é o que muda.
 */
const SCREEN_BY_PATH: Record<string, SidebarScreen> = {
  '/': 'dashboard',
  '/orders/new': 'novo',
  '/orders': 'pedidos',
  '/products': 'produtos',
};

const PATH_BY_SCREEN: Record<SidebarScreen, string> = {
  dashboard: '/',
  novo: '/orders/new',
  pedidos: '/orders',
  produtos: '/products',
};

const TITLE_BY_SCREEN: Record<SidebarScreen, string> = {
  dashboard: 'Resumo de vendas',
  novo: 'Novo Pedido',
  pedidos: 'Meus Pedidos',
  produtos: 'Minhas Chapas',
};

function screenForPath(pathname: string): SidebarScreen {
  return SCREEN_BY_PATH[pathname] ?? 'dashboard';
}

function ShellLayout({ children }: { children: (userName: string) => ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useCurrentUser();
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
      topbar={{
        showSearch: false,
        showNotifications: false,
        theme,
        onToggleTheme: toggleTheme,
        userName: user?.name ?? 'Indisponível',
        userRole: user?.email ?? 'Indisponível',
        userInitials: user ? getInitials(user.name) : '?',
      }}
      title={TITLE_BY_SCREEN[activeScreen]}
    >
      {children(user?.name ?? 'Indisponível')}
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
            {(userName) => (
              <Routes>
                <Route
                  path="/"
                  element={<DashboardPage dashboardContainer={dashboardContainer} userName={userName} />}
                />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/new" element={<NewOrderPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </ShellLayout>
        }
      />
    </Routes>
  );
}
