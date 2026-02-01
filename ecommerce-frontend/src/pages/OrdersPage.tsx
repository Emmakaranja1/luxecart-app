import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { ordersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button, OrderCardSkeleton } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-gray-500',
  processing: 'bg-gradient-primary',
  shipped: 'bg-gradient-secondary',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view orders');
      navigate('/auth?redirect=/orders');
      return;
    }

    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="page-transition">
        <div className="container-custom py-12">
          <h1 className="text-4xl font-display font-black text-gradient-hero mb-8">MY ORDERS</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-transition">
        <div className="container-custom py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-card rounded-full flex items-center justify-center">
              <Package className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="container-custom py-12">
        <h1 className="text-4xl md:text-5xl font-display font-black text-gradient-hero mb-8">
          MY ORDERS
          <span className="text-2xl text-gray-400 ml-4">({orders.length})</span>
        </h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/orders/${order.id}`} className="block group">
                <div className="card-glass p-6 hover:shadow-glow-primary transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="font-mono font-bold text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-semibold text-white">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <span className={`badge ${statusColors[order.status]} text-white uppercase`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gradient-primary">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">{order.items.length} items</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">
                      {order.shipping_address.city}, {order.shipping_address.state}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
