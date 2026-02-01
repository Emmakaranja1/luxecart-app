import { api } from './api';
import { 
  AdminUser, 
  Payment, 
  DashboardStats, 
  ProductFormData,
  Order,
  Product,
} from '@/types';

// Admin API
export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    return api.get('/admin/stats').then(res => res.data);
  },

  // Products Management
  createProduct: async (product: ProductFormData): Promise<Product> => {
    return api.post('/admin/products', product).then(res => res.data);
  },

  updateProduct: async (id: string, product: Partial<ProductFormData>): Promise<Product> => {
    return api.put(`/admin/products/${id}`, product).then(res => res.data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return api.delete(`/admin/products/${id}`).then(res => res.data);
  },

  // Orders Management
  getAllOrders: async (): Promise<Order[]> => {
    return api.get('/admin/orders').then(res => res.data);
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    return api.patch(`/admin/orders/${orderId}`, { status }).then(res => res.data);
  },

  // Payments Management
  getAllPayments: async (): Promise<Payment[]> => {
    return api.get('/admin/payments').then(res => res.data);
  },

  updatePaymentStatus: async (
    paymentId: string, 
    status: Payment['status']
  ): Promise<Payment> => {
    return api.patch(`/admin/payments/${paymentId}`, { status }).then(res => res.data);
  },

  // Users Management
  getAllUsers: async (): Promise<any[]> => {
    return api.get('/admin/users').then(res => res.data);
  },

  // Admin Profile
  getAdminProfile: async (): Promise<AdminUser> => {
    return api.get('/auth/me').then(res => ({
      ...res.data,
      role: res.data.role as 'admin' | 'super_admin',
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(res.data.first_name + ' ' + res.data.last_name)}`,
    }));
  },

  updateAdminProfile: async (data: Partial<AdminUser>): Promise<AdminUser> => {
    return api.put('/admin/profile', data).then(res => res.data);
  },
};
