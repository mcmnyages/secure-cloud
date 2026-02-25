import api from '../axios'

export const fileService = {
  Upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  list: () => api.get('/files'),

  getStorage: () => api.get('/auth/me'),

  delete: (id: string) => api.delete(`/files/${id}`),

  download: (id: string) =>
    api.get(`/files/download/${id}`, { responseType: 'blob' }),
}
