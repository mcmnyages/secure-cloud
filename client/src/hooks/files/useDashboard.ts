import { useState } from 'react'
import { useFilesQuery } from './useFilesQuery'
import { useFileMutations } from './useFileMutations'
import { useStorageQuery } from './useStorage'

export const useDashboard = () => {
  const { data: files = [], isLoading: filesLoading } = useFilesQuery()
  const { data: storage, isLoading: storageLoading } = useStorageQuery()
  const { uploadFile, deleteFile, downloadFile, bulkDeleteFiles } = useFileMutations()

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
    bulkDeleteFiles,
    downloadFile,
  }
}