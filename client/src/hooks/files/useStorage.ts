import { useState } from 'react'
import { fileService } from '../../api/services/fileService'

export const useStorage = () => {
  const [storage, setStorage] = useState({
    used: 0,
    limit: 104857600,
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchStorage = async () => {
    setIsLoading(true)
    try {
      const res = await fileService.getStorage()
      setStorage({
        used: Number(res.data.storageUsed),
        limit: Number(res.data.storageLimit),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { storage, fetchStorage, isLoading }
}
