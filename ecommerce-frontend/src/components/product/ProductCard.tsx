import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculateDiscountPercentage } from '@/utils/helpers';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const addItem = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const isOutOfStock = product.stock === 0;
  const discountPercentage = isOnSale 
    ? calculateDiscountPercentage(product.compare_at_price!, product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth?redirect=/cart');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div className="card-glass overflow-hidden hover:shadow-glow-primary transition-all duration-300">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-dark-lighter aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isOnSale && (
                <span className="badge-sale">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.featured && (
                <span className="badge-new">
                  Featured
                </span>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center">
                <span className="badge bg-red-500 text-white text-lg px-6 py-3">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Add to Cart Button - Shows on Hover */}
            {!isOutOfStock && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleAddToCart}
                className="absolute bottom-4 left-4 right-4 btn-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </motion.button>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gradient-primary">
                {formatCurrency(product.price)}
              </span>
              {isOnSale && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.compare_at_price!)}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            {!isOutOfStock && product.stock < 10 && (
              <p className="text-xs text-accent mt-2">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
