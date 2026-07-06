import api from '../axios'
import type { 
   UpdateUserRequest,
   UpdateUserSettingsRequest,
   UpdateProfileRequest,
   UpdatePasswordRequest
 } from '@/types/settingsTypes';

export const settingsService={
   getUserSettings: async ()=>{
    const response = await api.get('/settings/user');
    return response;
   },
   updateUser: async (payload:UpdateUserRequest)=>{
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      if(payload.avatarUrl){
      formData.append('avatar', payload.avatarUrl)
      }
      const {data} = await api.put('/settings/user',formData,{
         headers:{
         "Content-Type": "multipart/form-data",
         }
      });
      return data;
   },
   updateUserSettings: async (payload:UpdateUserSettingsRequest)=>{
      const {data} = await api.put('/settings/user/settings',payload);
      return data;
   },
   updateUserProfile:async (payload:UpdateProfileRequest)=>{
      const {data} = await api.put('/settings/user/profile', payload);
      return data;
   },
   updatePassword: async(payload:UpdatePasswordRequest)=>{
      const data = await api.patch('/settings/password', payload)
      return data;
   }
}