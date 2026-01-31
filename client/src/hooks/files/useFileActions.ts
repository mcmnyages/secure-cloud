import { toast } from 'sonner'
import { fileService } from '../../api/services/fileService'

export const useFileActions = (refresh: () => void) => {
  const deleteFile = async (id: string) => {
    if (!confirm('Delete this file?')) return

    try {
      await fileService.delete(id)
      toast.success('File deleted')
      refresh()
    } catch {
      toast.error('Failed to delete file')
    }
  }

  const downloadFile = async (id: string, name: string) => {
    try {
      const res = await fileService.download(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = name
      link.click()
    } catch {
      toast.error('Download failed')
    }
  }

  return { deleteFile, downloadFile }
}
