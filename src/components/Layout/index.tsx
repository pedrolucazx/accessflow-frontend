import { useSession } from '@/hooks/useSession';
import { Navigate, Outlet } from 'react-router';
import { Sidebar } from '../Sidebar';

export function Layout() {
  const { isAuth } = useSession();
  return (
    <div className="layout">
      <Sidebar />
      <main>{isAuth ? <Outlet /> : <Navigate to="/login" replace />}</main>
    </div>
  );
}
