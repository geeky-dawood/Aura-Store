import api from '@/lib/api-client';
import { User, Address } from '@/types';

export const userService = {
  getProfile: () => api.get<User>('/user/profile'),
  getById: (userId: string) => api.get<User>(`/user/profile-by?userId=${userId}`),
  updateProfile: (data: any) => api.patch('/user/update-profile', data),
  deleteProfile: () => api.delete('/user/delete-profile'),
};

export const addressService = {
  create: (data: Partial<Address>) => api.post('/address/create', data),
  delete: (addressId: string) => api.delete(`/address/delete-address?address_id=${addressId}`),
};
