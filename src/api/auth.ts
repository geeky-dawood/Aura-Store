import api from '@/lib/api-client';
import { AuthResponse } from '@/types';

export const authService = {
  login: (data: any) => api.post<AuthResponse>('/auth/signin', data),
  signup: (data: any) => api.post('/auth/signup', data),
};
