import { useState } from 'react'
import { useFilesQuery } from './useFilesQuery'
import { useFileMutations } from './useFileMutations'
import { useStorage } from './useStorage'

export const useDashboard = () => {
  const { data: files = [], isLoading: filesLoading } = useFilesQuery()
  const { storage, isLoading: storageLoading } = useStorage()
  const { uploadFile, deleteFile, downloadFile } = useFileMutations()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLoading = filesLoading || storageLoading

  return {
    files,
    storage,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    uploadFile,
    deleteFile,
    downloadFile,
  }
}