import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RootState } from '@/lib/redux/store';

/**
 * Hook to monitor for 401 errors and handle session expiration
 * Shows a toast when session expires and redirects to login
 */
export function useSessionExpiration() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // If token was cleared but user was previously authenticated, show message and redirect
    if (!token && !isAuthenticated) {
      const wasAuthenticated = sessionStorage.getItem('wasAuthenticated');
      
      if (wasAuthenticated === 'true') {
        toast.error('Your session has expired. Please login again.', {
          duration: 5000,
        });
        sessionStorage.removeItem('wasAuthenticated');
        navigate('/auth');
      }
    } else if (token && isAuthenticated) {
      // Mark that user was authenticated
      sessionStorage.setItem('wasAuthenticated', 'true');
    }
  }, [token, isAuthenticated, navigate]);
}
