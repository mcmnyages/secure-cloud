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

  const fetchFiles = async () => {
    const res = await fileService.list()
    setFiles(res.data)
  }

  return { files, fetchFiles, setFiles }
}
