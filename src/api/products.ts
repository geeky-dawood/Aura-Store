import api from '@/lib/api-client';
import { Product } from '@/types';

export const productService = {
  getAll: () => api.get<{ data: Product[]; meta: any }>('/product/all-products'),

  delete: (id: string) => api.delete(`/product/delete/${id}`),
  add: (data: any) => api.post('/product/add-product', data),
  update: (id: string, data: any) => api.patch(`/product/update/${id}`, data),
  updateStock: (data: { productId: string; stock: number }) => api.patch('/product/update-stock', data),
  uploadImage: (productId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/image-upload/upload/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
