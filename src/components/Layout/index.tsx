import { ROUTES } from '@/config/routes';
import { useSession } from '@/hooks/useSession';
import { Navigate, Outlet } from 'react-router';
import { Sidebar } from '../Sidebar';

export function Layout() {
  const { isAuth } = useSession();
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        {isAuth ? (
          <Outlet />
        ) : (
          <Navigate to={ROUTES.NOT_PROTECTED.LOGIN} replace />
        )}
      </main>
    </div>
  );
}
