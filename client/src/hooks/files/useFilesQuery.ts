import { useQuery } from '@tanstack/react-query'
import { fileService } from '@/api/services/fileService'
import type { CloudFile } from '@/types/fileTypes'

export const useFilesQuery = () => {
  return useQuery<CloudFile[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fileService.list()
      return res.data
    },
  })
}