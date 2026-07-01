import api from '../axios'

export const settingsService={
   getUserSettings: async ()=>{
    const response = await api.get('/settings/user');
    return response;
   }
}