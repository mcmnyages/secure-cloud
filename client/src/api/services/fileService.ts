import api from '../axios'

export const fileService = {
  list: () => api.get('/files'),

  getStorage: () => api.get('/auth/me'),

  delete: (id: string) => api.delete(`/files/${id}`),

  download: (id: string) =>
    api.get(`/files/download/${id}`, { responseType: 'blob' }),
}
