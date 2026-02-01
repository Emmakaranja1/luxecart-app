import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { ordersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Skeleton } from '@/components/common';
import { formatCurrency, formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-gray-500',
  processing: 'bg-gradient-primary',
  shipped: 'bg-gradient-secondary',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusSteps: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view order details');
      navigate('/auth?redirect=/orders');
      return;
    }

    loadOrder();
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      const data = await ordersApi.getById(id);
      if (data) {
        setOrder(data);
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="page-transition">
        <div className="container-custom py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="page-transition">
      <div className="container-custom py-12">
        <Link to="/orders" className="inline-flex items-center text-primary hover:text-primary-light mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-400">{formatDateTime(order.created_at)}</p>
          </div>
          <span className={`badge ${statusColors[order.status]} text-white uppercase text-lg px-6 py-3`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <div className="card-glass p-6">
                <h2 className="text-xl font-display font-bold text-white mb-6">Order Status</h2>
                <div className="flex justify-between relative">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        index <= currentStepIndex 
                          ? 'bg-gradient-primary shadow-glow-primary' 
                          : 'bg-dark-lighter'
                      }`}>
                        {index < currentStepIndex ? (
                          <CheckCircle className="w-6 h-6 text-dark" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <p className={`text-xs mt-2 capitalize ${
                        index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {step}
                      </p>
                      {index < statusSteps.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-dark-lighter'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="card-glass p-6">
              <h2 className="text-xl font-display font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 pb-4 border-b border-primary/20 last:border-0">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-lg object-cover bg-dark-lighter"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.product_name}</h3>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-sm text-primary">{formatCurrency(item.unit_price)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="card-glass p-6">
              <h2 className="text-xl font-display font-bold text-white mb-4">Shipping Address</h2>
              <div className="text-gray-300 space-y-1">
                <p className="font-semibold text-white">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
                <p className="pt-2">{order.shipping_address.email}</p>
                <p>{order.shipping_address.phone}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card-gradient">
              <h2 className="text-xl font-display font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{order.shipping_cost === 0 ? 'FREE' : formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t border-primary/30 pt-2 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-gradient-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
