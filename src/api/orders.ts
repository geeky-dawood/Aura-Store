import api from '@/lib/api-client';
import { Order, OrderStatus } from '@/types';

export const orderService = {
  create: (userId: string, items: any) => api.post(`/order/create?user_id=${userId}`, { items }),
  getByUserId: (userId: string, page = 1, limit = 10) => 
    api.get(`/order/user/${userId}?page=${page}&limit=${limit}`),
  getAll: (filter: OrderStatus, page = 1, limit = 10) => 
    api.get(`/order/all-orders?filter=${filter}&page=${page}&limit=${limit}`),
  getById: (orderId: string) => api.get(`/order/${orderId}`),
  delete: (orderId: string) => api.delete(`/order/delete/${orderId}`),
  updateStatus: (orderId: string, status: OrderStatus) => 
    api.patch(`/order/change-order-status?order_id=${orderId}&status=${status}`),
};
