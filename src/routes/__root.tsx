import { createRootRouteWithContext, Outlet, HeadContent } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { AuthUser } from '@/lib/auth';

interface RouterContext {
  user: AuthUser | null;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="auth-title">404</h1>
        <p className="auth-subtitle">Page introuvable</p>
        <a href="/app/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Retour au tableau de bord
        </a>
      </div>
    </div>
  ),
});

function RootLayout() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
