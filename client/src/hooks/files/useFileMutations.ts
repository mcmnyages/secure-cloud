import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fileService } from '@/api/services/fileService'
import { getErrorMessage } from '@/utils/errors/getErrorMessage'

export const useFileMutations = () => {
  const queryClient = useQueryClient()

  const uploadFile = useMutation({
    mutationFn: (files: File[]) => fileService.Upload(files),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('Files uploaded')
    },

    onError: (error: any) => {
      toast.error(getErrorMessage(error))
    },
  })

  const renameFile = useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      fileService.renameFile(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File renamed')
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error))
    },
  })

  const uploadNewVersion = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      fileService.uploadNewVersion(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('New version uploaded')
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error))
    },
  })

  const deleteFile = useMutation({
    mutationFn: (id: string) => fileService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File deleted')
    },

    onError: (error: any) => {
      toast.error(getErrorMessage(error))
    },
  })

  const bulkDeleteFiles = useMutation({
    mutationFn: (ids: string[]) => fileService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('Files deleted')
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error))
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
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return {
    uploadFile, 
    deleteFile,
    downloadFile, 
    bulkDeleteFiles, 
    renameFile, 
    uploadNewVersion
  }
}