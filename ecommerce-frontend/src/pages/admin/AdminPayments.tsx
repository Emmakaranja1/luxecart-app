import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Payment } from '@/types/admin';
import { adminApi } from '@/services/adminApi';
import { Button, Skeleton } from '@/components/common';
import { formatCurrency, formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Payment['status'] | 'all'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await adminApi.getAllPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: Payment['status']) => {
    try {
      await adminApi.updatePaymentStatus(paymentId, status);
      setPayments(payments.map(p =>
        p.id === paymentId ? { ...p, status } : p
      ));
      toast.success(`Payment ${status}`);
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter);

  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    refunded: 'bg-blue-500',
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-black text-gradient-hero">
        Payment Verification
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['all', 'pending', 'approved', 'rejected', 'refunded'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === status
                ? 'bg-primary text-dark'
                : 'bg-dark-card text-gray-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-glass p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white">
                    Payment #{payment.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[payment.status]}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Order ID</p>
                    <p className="text-white">#{payment.order_id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="text-primary font-bold">{formatCurrency(payment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="text-white">{payment.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="text-white">{formatDateTime(payment.created_at)}</p>
                  </div>
                </div>
              </div>

              {payment.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleUpdateStatus(payment.id, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(payment.id, 'rejected')}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 card-glass">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No {filter !== 'all' && filter} payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};
