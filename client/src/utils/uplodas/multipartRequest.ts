import api from '../../api/axios'
import type { Method, AxiosRequestConfig } from 'axios'

type MultipartOptions = {
  method: Method
  url: string
  files?: { fieldName: string; file: File }[]
  data?: Record<string, any>
  config?: AxiosRequestConfig
}

export const multipartRequest = (p0: string, p1: string, file: File, {
  method, url, files = [], data = {}, config = {},
}: MultipartOptions) => {
  const formData = new FormData()

  files.forEach(({ fieldName, file }) => {
    formData.append(fieldName, file)
  })

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return api.request({
    method,
    url,
    data: formData,
    ...config,
  })
}