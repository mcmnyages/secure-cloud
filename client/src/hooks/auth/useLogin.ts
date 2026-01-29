// hooks/auth/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';
import type { LoginCredentials, AuthResponse } from '../../types/authTypes';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: any) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess,
    onError,
  });
};
