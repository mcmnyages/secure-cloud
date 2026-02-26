import api from '../axios'
import { multipartRequest } from '@/utils/uplodas/multipartRequest'

export const fileService = {
  Upload: (files: File[], replace?: boolean) => {
  return multipartRequest({
    method: 'POST',
    url: '/files/upload',
    files: files.map(file => ({
      fieldName: 'files',
      file,
    })),
    data: {
      replace: replace ? 'true' : 'false',
    },
  })
},

  list: () => api.get('/files'),

  getStorage: () => api.get('/auth/me'),

  renameFile: (id: string, name: string) =>
    api.patch(`/files/${id}/rename`, { name }),

  uploadNewVersion: (id: string, file: File) => {
    return multipartRequest({
      method: 'PUT',
      url: `/files/${id}`,
      files: [{ fieldName: 'file', file }],
      
    })
  },

  delete: (id: string) => api.delete(`/files/${id}`),

  bulkDelete: (ids: string[]) => api.delete('/files/bulk-delete', { data: { fileIds:ids } }),

  download: (id: string) =>
    api.get(`/files/download/${id}`, { responseType: 'blob' }),
}
