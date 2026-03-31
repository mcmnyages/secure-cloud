const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const REFRESH_KEY = 'refreshToken'

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),

  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY)
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  setAuth: (token: string, user: any, refreshToken?: string | null) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken)
    }
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}