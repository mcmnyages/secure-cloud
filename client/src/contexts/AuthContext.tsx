// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/services/authService';
import api from '../api/axios';
import type { User } from '../types/authTypes';

interface AuthTokens {
  token: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthHeader: (token: string) => void;
  clearAuthHeader: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for token storage
const storage = {
  getToken: () => localStorage.getItem('auth_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setTokens: (token: string, refreshToken?: string) => {
    localStorage.setItem('auth_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<User | null>(storage.getUser());

  // Function to set auth header on axios instance
  const setAuthHeader = useCallback((newToken: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
  }, []);

  // Function to clear auth header
  const clearAuthHeader = useCallback(() => {
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
  }, []);

  // Initialize axios header on mount
  useEffect(() => {
    const savedToken = storage.getToken();
    if (savedToken) {
      setAuthHeader(savedToken);
    }
  }, [setAuthHeader]);

  // Fetch user data if token exists
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth-user', token],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Sync user data with state and storage
  useEffect(() => {
    if (userData) {
      setUser(userData);
      storage.setUser(userData);
    }
  }, [userData]);

  // Handle auth errors
  useEffect(() => {
    if (error && token) {
      // If we get a 401 error, the token might be invalid
      if (error.response?.status === 401) {
        logout();
      }
    }
  }, [error, token]);

  const login = useCallback((tokens: AuthTokens, newUser: User) => {
    const { token: newToken, refreshToken } = tokens;
    
    // Store tokens
    storage.setTokens(newToken, refreshToken);
    storage.setUser(newUser);
    
    // Update axios header
    setAuthHeader(newToken);
    
    // Update state
    setUser(newUser);
    
    // Refetch user data
    refetch();
  }, [setAuthHeader, refetch]);

  const logout = useCallback(() => {
    // Clear storage
    storage.clear();
    
    // Clear axios header
    clearAuthHeader();
    
    // Clear state
    setUser(null);
    
    // Clear TanStack Query cache
    // This will be handled by the logout mutation
  }, [clearAuthHeader]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
        setAuthHeader,
        clearAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};