// api/services/authService.ts
import api from '../axios';
import type { 
  LoginCredentials, 
  RegisterData, 
  RegisterResponse,
  AuthResponse,
  RefreshTokenResponse 
} from '../../types/authTypes';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  },

   
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.log('Logout error:', error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
  //not yet implemented

  // Helper to check if token is valid
  validateToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },
};