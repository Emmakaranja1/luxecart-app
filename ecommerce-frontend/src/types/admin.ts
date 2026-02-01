export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'super_admin';
  avatar_url?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_products: number;
  total_customers: number;
  revenue_change: number;
  orders_change: number;
}

export interface ProductFormData {
  name: string;
  category_id: string;
  description: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  featured: boolean;
  image_url: string;
  images?: string[];
}
