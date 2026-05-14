import api from '@/lib/api-client';

export const paymentService = {
  checkout: (data: { order_id: string; amount: number; currency: string; description: string }) => 
    api.post('/payment/checkout', data),
  getStatus: (id: string) => api.get(`/payment/${id}/status`),
  getLogs: (id: string) => api.get(`/payment/${id}/logs`),
};
