import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common';
import { formatCurrency } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to proceed to checkout');
      navigate('/auth?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page-transition">
        <div className="container-custom py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-card rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="page-transition">
      <div className="container-custom py-12">
        <h1 className="text-4xl md:text-5xl font-display font-black text-gradient-hero mb-8">
          SHOPPING CART
          <span className="text-2xl text-gray-400 ml-4">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glass p-6"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-dark-lighter"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold text-white hover:text-primary transition-colors line-clamp-2 mb-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xl font-bold text-gradient-primary">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center border-2 border-primary/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-primary/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-bold min-w-[50px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-primary/10 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-gradient sticky top-24"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-primary/30 pt-4 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-gradient-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-accent mb-6">
                  Add {formatCurrency(100 - subtotal)} more for free shipping!
                </p>
              )}

              <Button
                variant="hero"
                size="lg"
                onClick={handleCheckout}
                className="w-full mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Link to="/products">
                <Button variant="ghost" size="md" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
