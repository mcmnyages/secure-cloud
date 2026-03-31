import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { isTokenExpired } from '@/utils/auth/authUtils'
import { authStorage } from '@/utils/auth/authStorage'
import { toast } from 'sonner'
import { authService } from '@/api/services/authService'
import type { RefreshTokenResponse } from '@/types/authTypes'

interface Props {
  token: string | null
  refreshToken: string | null
  setToken: (t: string | null) => void
  setRefreshToken: (t: string | null) => void
  logout: () => void
}

export const useAuthInit = ({
  token,
  refreshToken,
  setToken,
  setRefreshToken,
  logout,
}: Props) => {
  const query = useQuery<RefreshTokenResponse | null>({
    queryKey: ['auth-init'],
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,

    queryFn: async () => {
      if (!token) return null

      // ✅ token still valid → return SAME SHAPE
      if (!isTokenExpired(token)) {
        return {
          token,
          refreshToken: refreshToken ?? undefined,
        }
      }

      // ❌ no refresh token
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      // 🔁 refresh
      return await authService.refreshToken(refreshToken)
    },
  })

  // ✅ SUCCESS
  useEffect(() => {
    if (!query.data) return

    const { token: newToken, refreshToken: newRefresh } = query.data

    if (newToken !== token) {
      setToken(newToken)
      setRefreshToken(newRefresh ?? null)

      authStorage.setAuth(
        newToken,
        authStorage.getUser(),
        newRefresh
      )

      toast.success('Session refreshed!')
    }
  }, [query.data])

  // ❌ ERROR
  useEffect(() => {
    if (!query.error) return

    toast.error('Session expired. Please log in again.')
    logout()
  }, [query.error])

  return {
    loading: query.isLoading,
  }
}