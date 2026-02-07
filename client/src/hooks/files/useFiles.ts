import { useState } from 'react'
import { fileService } from '../../api/services/fileService'

export interface CloudFile {
  mimeType: string
  id: string
  name: string
  size: number
  createdAt: string
}

export const useFiles = () => {
  const [files, setFiles] = useState<CloudFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const res = await fileService.list()
      setFiles(res.data)
    } finally {
      setIsLoading(false)
    }
  }

  return { files, fetchFiles, setFiles, isLoading }
}
