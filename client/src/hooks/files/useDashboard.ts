import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useFiles } from './useFiles'
import { useStorage } from './useStorage'
import { useFileActions } from './useFileActions'

export const useDashboard = () => {
  const { files, fetchFiles } = useFiles()
  const { storage, fetchStorage } = useStorage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const refresh = async () => {
    try {
      await Promise.all([fetchFiles(), fetchStorage()])
    } catch {
      toast.error('Failed to load dashboard')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const { deleteFile, downloadFile } = useFileActions(refresh)

  return {
    files,
    storage,
    isModalOpen,
    setIsModalOpen,
    refresh,
    deleteFile,
    downloadFile,
  }
}
