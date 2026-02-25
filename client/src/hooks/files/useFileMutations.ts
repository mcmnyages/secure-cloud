import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fileService } from '../../api/services/fileService'

export const useFileMutations = () => {
  const queryClient = useQueryClient()

  const uploadFile = useMutation({
    mutationFn: (file: File) => fileService.Upload(file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File uploaded')
    },

    onError: () => {
      toast.error('Upload failed')
    },
  })

  const deleteFile = useMutation({
    mutationFn: (id: string) => fileService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File deleted')
    },

    onError: () => {
      toast.error('Delete failed')
    },
  })

  const downloadFile = async (id: string, name: string) => {
    try {
      const res = await fileService.download(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = name
      link.click()
      toast.success('Download started')
    } catch {
      toast.error('Download failed')
    }
  }

  return { uploadFile, deleteFile, downloadFile }
}