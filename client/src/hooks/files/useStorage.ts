// hooks/useStorageQuery.ts

import { useQuery } from '@tanstack/react-query'
import { fileService } from '@/api/services/fileService'

interface StorageInfo {
  used: number
  limit: number
}

export const useStorageQuery = () => {
  return useQuery<StorageInfo>({
    queryKey: ['storage'],

    queryFn: async () => {
      const res = await fileService.getStorage()

      return {
        used: Number(res.data.storageUsed),
        limit: Number(res.data.storageLimit),
      }
    },

    staleTime: 1000 * 60 * 2, // 2 minutes (optional but recommended)
  })
}