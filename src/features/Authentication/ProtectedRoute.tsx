import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { useEffect } from 'react';

type ProtectionRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectionRouteProps) {
  const { isAuthenticatedAdmin } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticatedAdmin) {
      navigate('/login');
    }
  }, [isAuthenticatedAdmin, navigate]);

  return isAuthenticatedAdmin ? children : null;
}

export default ProtectedRoute;
