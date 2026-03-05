import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { decodeJwt } from '../utils/auth/tokenHelper'// Helper to decode JWT

import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  )
  const [user, setUser] = useState<User | null>(null)

  // Initialize user safely and check token expiry
  useEffect(() => {
    if (!token) return

    // Check token expiration
    const decoded = decodeJwt(token);
    if (decoded && decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        toast.error('Session expired. Please log in again.');
        logout();
        return;
      }
      // Set timeout to auto-logout when token expires
      const msUntilExpiry = (decoded.exp - now) * 1000;
      const timeout = setTimeout(() => {
        toast.error('Session expired. Please log in again.');
        logout();
      }, msUntilExpiry);
      return () => clearTimeout(timeout);
    }

    try {
      const storedUser = localStorage.getItem(USER_KEY)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch {
      console.error('Failed to parse stored user')
      logout()
    }
  }, [token])

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem(TOKEN_KEY))
      const storedUser = localStorage.getItem(USER_KEY)
      setUser(storedUser ? JSON.parse(storedUser) : null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)

    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))

    toast.success(`Welcome back${newUser.name ? `, ${newUser.name}` : ''}!`)
  }

  const logout = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    toast.info('You’ve been logged out')
  }

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updatedUser = { ...prev, ...updatedFields }
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
