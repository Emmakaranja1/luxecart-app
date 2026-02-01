import axios from 'axios';
import { 
  Product, 
  Category, 
  Order, 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse,
  ShippingAddress,
  ProductFilters,
  SortOption,
} from '@/types';

// ==========================
// Backend API Base URL
// ==========================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://luxecart-backend-82cb.onrender.com';

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================
// Categories API
// ==========================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return api.get('/api/categories').then(res => res.data);
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    return api.get(`/api/categories/${slug}`).then(res => res.data).catch(() => null);
  },
};

// ==========================
// Products API
// ==========================
export const productsApi = {
  getAll: async (filters?: ProductFilters, sort?: SortOption): Promise<Product[]> => {
    return api.get('/api/products', { params: { ...filters, sort } }).then(res => res.data);
  },

  getById: async (id: string): Promise<Product | null> => {
    return api.get(`/api/products/${id}`).then(res => res.data).catch(() => null);
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    return api.get(`/api/products/slug/${slug}`).then(res => res.data).catch(() => null);
  },

  getFeatured: async (): Promise<Product[]> => {
    return api.get('/api/products/featured').then(res => res.data);
  },
};

// ==========================
// Auth API
// ==========================
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post('/api/auth/login', credentials).then(res => res.data);
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return api.post('/api/auth/signup', credentials).then(res => res.data);
  },

  logout: async (): Promise<void> => {
    return api.post('/api/auth/logout').then(res => res.data);
  },

  getCurrentUser: async (): Promise<User | null> => {
    return api.get('/api/auth/me').then(res => res.data).catch(() => null);
  },
};

// ==========================
// Orders API
// ==========================
export const ordersApi = {
  create: async (
    shippingAddress: ShippingAddress, 
    items: Array<{ product_id: string; quantity: number }>
  ): Promise<Order> => {
    // Build order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await productsApi.getById(item.product_id);
        if (!product) throw new Error('Product not found');
        return {
          product_id: product.id,
          product_name: product.name,
          product_image: product.image_url,
          quantity: item.quantity,
          unit_price: product.price,
        };
      })
    );

    return api.post('/api/orders', { 
      shipping_address: shippingAddress, 
      items: orderItems 
    }).then(res => res.data);
  },

  getAll: async (): Promise<Order[]> => {
    return api.get('/api/orders').then(res => res.data);
  },

  getById: async (id: string): Promise<Order | null> => {
    return api.get(`/api/orders/${id}`).then(res => res.data).catch(() => null);
  },
};

export default api;

