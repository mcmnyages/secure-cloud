// hooks/useAuthStatus.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/services/authService';

export const useAuthStatus = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const { isLoading: tokenValidating, error } = useQuery({
    queryKey: ['validate-token'],
    queryFn: () => authService.validateToken(),
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (error && isAuthenticated) {
      // Token is invalid, logout user
      logout();
    }
  }, [error, isAuthenticated, logout]);

  return {
    isAuthenticated,
    isLoading: authLoading || tokenValidating,
    error,
  };
};