import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';
import { DashboardStats, Order } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { Skeleton } from '@/components/common';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAllOrders(),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.total_revenue || 0),
      change: stats?.revenue_change || 0,
      icon: DollarSign,
      color: 'primary',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      change: stats?.orders_change || 0,
      icon: ShoppingBag,
      color: 'secondary',
    },
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'accent',
    },
    {
      title: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: 'primary',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-black text-gradient-hero mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">Welcome back, Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-glass p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 ${
                    stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-primary hover:text-primary-light flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="block p-4 rounded-lg bg-dark-card hover:bg-dark-lighter transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order.shipping_address.full_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(order.total)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/products/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-gradient p-6 cursor-pointer"
          >
            <Package className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-white mb-1">Add Product</h3>
            <p className="text-sm text-gray-400">Create a new product listing</p>
          </motion.div>
        </Link>

        <Link to="/admin/orders">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-gradient p-6 cursor-pointer"
          >
            <ShoppingBag className="w-8 h-8 text-secondary mb-3" />
            <h3 className="font-bold text-white mb-1">Manage Orders</h3>
            <p className="text-sm text-gray-400">View and update orders</p>
          </motion.div>
        </Link>

        <Link to="/admin/payments">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-gradient p-6 cursor-pointer"
          >
            <DollarSign className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-bold text-white mb-1">Verify Payments</h3>
            <p className="text-sm text-gray-400">Approve or reject payments</p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};
