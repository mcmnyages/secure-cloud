import { useQuery } from '@tanstack/react-query'
import { fileService } from '../../api/services/fileService'

export interface CloudFile {
  id: string
  name: string
  size: number
  mimeType: string
  createdAt: string
}

export const useFilesQuery = () => {
  return useQuery<CloudFile[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fileService.list()
      return res.data
    },
  })
}