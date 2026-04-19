import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getHomePathByRole } from '../../utils/roleRoute';

export function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <>{children}</>;
}
