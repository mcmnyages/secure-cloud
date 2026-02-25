// utils/getErrorMessage.ts
import { AxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as any)?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    )
  }

  return 'Something went wrong'
}