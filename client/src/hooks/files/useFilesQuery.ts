import { useQuery } from '@tanstack/react-query'
import { fileService } from '@/api/services/fileService'
import type { CloudFile, FlatFile } from '@/types/fileTypes'

export const useFilesQuery = () => {
  return useQuery<CloudFile[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fileService.list()   // <-- remove <FlatFile[]>
      const flatFiles: FlatFile[] = res.data // <-- explicitly type it

      const mapped: CloudFile[] = flatFiles.map(f => ({
        id: f.id,
        createdAt: f.createdAt,
        currentVersion: {
          id: f.versionId,
          versionNumber: f.versionNumber,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType,
          createdAt: f.createdAt,
        },
      }))

      return mapped
    },
  })
}