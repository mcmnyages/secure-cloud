import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { decodeJwt } from '../utils/auth/tokenHelper'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string, user: User, refreshToken?: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const REFRESH_KEY = 'refreshToken'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Restore immediately (CRITICAL FIX)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  )

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem(REFRESH_KEY)
  )

  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY)
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  /* ---------------- INIT AUTH (on refresh) ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const decoded = decodeJwt(token)

        if (decoded?.exp) {
          const now = Math.floor(Date.now() / 1000)

          // 🔁 Token expired → try refresh
          if (decoded.exp < now) {
            if (refreshToken) {
              try {
                const { authService } = await import('../api/services/authService')
                const res = await authService.refreshToken(refreshToken)

                setToken(res.token)
                setRefreshToken(res.refreshToken || null)

                localStorage.setItem(TOKEN_KEY, res.token)
                if (res.refreshToken) {
                  localStorage.setItem(REFRESH_KEY, res.refreshToken)
                }

                toast.success('Session refreshed!')
              } catch {
                toast.error('Session expired. Please log in again.')
                logout()
              }
            } else {
              logout()
            }
          }
        }
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [token])

  /* ---------------- SYNC ACROSS TABS ---------------- */
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem(TOKEN_KEY))
      setRefreshToken(localStorage.getItem(REFRESH_KEY))

      const storedUser = localStorage.getItem(USER_KEY)
      setUser(storedUser ? JSON.parse(storedUser) : null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  /* ---------------- LOGIN ---------------- */
  const login = (newToken: string, newUser: User, newRefreshToken?: string) => {
    setToken(newToken)
    setUser(newUser)
    setRefreshToken(newRefreshToken || null)

    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))

    if (newRefreshToken) {
      localStorage.setItem(REFRESH_KEY, newRefreshToken)
    }

    toast.success(`Welcome back${newUser.name ? `, ${newUser.name}` : ''}!`)
  }

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    setToken(null)
    setUser(null)
    setRefreshToken(null)

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REFRESH_KEY)

    toast.info('You’ve been logged out')
  }

  /* ---------------- UPDATE USER ---------------- */
  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev

      const updatedUser = { ...prev, ...updatedFields }
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

      return updatedUser
    })
  }

  /* ---------------- CONTEXT VALUE ---------------- */
  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      loading,
      isAuthenticated: Boolean(token && user), // ✅ FIXED
      login,
      logout,
      updateUser,
    }),
    [user, token, refreshToken, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------------- HOOK ---------------- */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export default AuthProvider