import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Order } from '@/types';
import { adminApi } from '@/services/adminApi';
import { Button, OrderCardSkeleton } from '@/components/common';
import { formatCurrency, formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await adminApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      ));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const statusColors = {
    pending: 'bg-gray-500',
    processing: 'bg-primary',
    shipped: 'bg-secondary',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-black text-gradient-hero">
        Orders Management
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-glass p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-white">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Customer</p>
                    <p className="text-white">{order.shipping_address.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total</p>
                    <p className="text-primary font-bold">{formatCurrency(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Items</p>
                    <p className="text-white">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="text-white">{formatDateTime(order.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                  className={`px-4 py-2 rounded-lg font-semibold text-white ${statusColors[order.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Link to={`/admin/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 card-glass">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
