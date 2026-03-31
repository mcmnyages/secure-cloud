import { decodeJwt } from './tokenHelper'

export const isTokenExpired = (token: string) => {
  try {
    const decoded = decodeJwt(token)

    if (!decoded?.exp) return true

    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
  } catch {
    return true
  }
}