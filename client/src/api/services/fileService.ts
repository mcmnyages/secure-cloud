import api from '../axios'
import { multipartRequest } from '@/utils/uplodas/multipartRequest'

export const fileService = {
  Upload: (file: File) => {
    return multipartRequest('POST', '/files/upload', file, {
      method: 'POST',
      url: '/files/upload',
      files: [{ fieldName: 'file', file }],
    })
  },

  list: () => api.get('/files'),

  getStorage: () => api.get('/auth/me'),

  renameFile: (id: string, newName: string) =>
    api.put(`/files/${id}/rename`, { newName }),

  uploadNewVersion: (id: string, file: File) => {
    return multipartRequest('PUT', `/files/${id}`, file, {
      method: 'PUT',
      url: `/files/${id}`,
      files: [{ fieldName: 'file', file }],
    })
  },

  delete: (id: string) => api.delete(`/files/${id}`),

  bulkDelete: (ids: string[]) => api.post('/files/bulk-delete', { fileIds:ids }),

  download: (id: string) =>
    api.get(`/files/download/${id}`, { responseType: 'blob' }),
}
