import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/layout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  AuthPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
  NotFoundPage,
} from '@/pages';
import {
  AdminDashboard,
  AdminProducts,
  AdminProductForm,
  AdminOrders,
  AdminPayments,
  AdminProfile,
} from '@/pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#151520',
            color: '#fff',
            border: '2px solid rgba(0, 245, 255, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#00F5FF',
              secondary: '#0A0A0F',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF00FF',
              secondary: '#0A0A0F',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
