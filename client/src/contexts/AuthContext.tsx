import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authStorage } from '@/utils/auth/authStorage'
import { useAuthInit } from '@/hooks/auth/useAuthInit'
import { toast } from 'sonner'
import type { User } from '@/types/authTypes'

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string, user: User, refreshToken?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [token, setToken] = useState<string | null>(() =>
    authStorage.getToken()
  )

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    authStorage.getRefreshToken()
  )

  const [user, setUser] = useState<User | null>(() =>
    authStorage.getUser()
  )

  // 🔥 LOGOUT (with cache clear)
  const logout = () => {
    setToken(null)
    setUser(null)
    setRefreshToken(null)

    authStorage.clear()

    // ✅ CRITICAL
    queryClient.clear()

    toast.info('You’ve been logged out')
  }

  // 🔁 INIT AUTH
  const { loading } = useAuthInit({
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    logout,
  })

  // 🔐 LOGIN
  const login = (
    newToken: string,
    newUser: User,
    newRefreshToken?: string
  ) => {
    setToken(newToken)
    setUser(newUser)
    setRefreshToken(newRefreshToken || null)

    authStorage.setAuth(newToken, newUser, newRefreshToken)

    toast.success(
      `Welcome back${newUser.name ? `, ${newUser.name}` : ''}!`
    )
  }

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, refreshToken, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}