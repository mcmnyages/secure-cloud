// hooks/useAuthMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/services/authService';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/authTypes';

// ==================== LOGIN MUTATION ====================
export const useLoginMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Update auth context
      login({ token: data.token }, data.user);
      
      // Update TanStack Query cache
      queryClient.setQueryData(['auth-user'], data.user);
      queryClient.setQueryData(['auth-token'], data.token);
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    },
    onError: (error: any) => {
      // Error will be handled in the form hook
      console.error('Login error:', error);
    },
  });
};

// ==================== REGISTER MUTATION ====================
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Clear any previous auth data
      queryClient.removeQueries({ queryKey: ['auth'] });
      
      // Show success message
      console.log('Registration successful:', data);
      
      // You could automatically login after registration:
      // login(data.token, data.user);
      // navigate('/dashboard');
      
      // Or redirect to login page with success message
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Registration successful! Please login with your credentials.' 
        }
      });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      // Error will be handled in the form hook
    },
  });
};

// ==================== LOGOUT MUTATION ====================
export const useLogoutMutation = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth context
      logout();
      
      // Clear all queries from cache
      queryClient.clear();
      
      // Navigate to login
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local state
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
};

// ==================== REFRESH TOKEN MUTATION ====================
export const useRefreshTokenMutation = () => {
  // const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: (data) => {
      // Update auth context with new token
      // Note: We need the user object here - you might need to fetch it separately
      // or include it in the refresh response
      
      // Update cache
      queryClient.setQueryData(['auth-token'], data.token);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // Token refresh failed - trigger logout
      queryClient.clear();
      localStorage.clear();
      window.location.href = '/login';
    },
  });
};

// ==================== PASSWORD RESET MUTATION ====================
export const usePasswordResetMutation = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Password reset request failed');
      }
      
      return response.json();
    },
  });
};

// ==================== VERIFY EMAIL MUTATION ====================
export const useVerifyEmailMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      
      if (!response.ok) {
        throw new Error('Email verification failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      navigate('/login', { 
        state: { message: 'Email verified successfully! Please login.' }
      });
    },
  });
};