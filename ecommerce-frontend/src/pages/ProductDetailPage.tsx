import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, Check, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/types';
import { productsApi } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button, Skeleton } from '@/components/common';
import { formatCurrency, calculateDiscountPercentage } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    try {
      const prod = await productsApi.getBySlug(slug);
      if (prod) {
        setProduct(prod);
      } else {
        navigate('/404');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/404');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth?redirect=/cart');
      return;
    }

    if (!product) return;

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    addItem(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="page-transition">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = isOnSale ? calculateDiscountPercentage(product.compare_at_price!, product.price) : 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="page-transition">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-dark-card"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOnSale && (
                <div className="absolute top-4 left-4">
                  <span className="badge-sale text-lg px-4 py-2">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary shadow-glow-primary'
                        : 'border-dark-lighter hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-gradient-primary">
                  {formatCurrency(product.price)}
                </span>
                {isOnSale && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formatCurrency(product.compare_at_price!)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="badge bg-red-500 text-white">Out of Stock</span>
                ) : product.stock < 10 ? (
                  <span className="badge-stock">Only {product.stock} left!</span>
                ) : (
                  <span className="badge bg-green-500 text-white flex items-center gap-2 w-fit">
                    <Check className="w-4 h-4" />
                    In Stock
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-primary/30 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        className="p-3 hover:bg-primary/10 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 py-3 font-bold min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="p-3 hover:bg-primary/10 transition-colors"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-gray-400">
                      {product.stock} available
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button variant="ghost" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Info Accordion */}
              <div className="space-y-4">
                <div className="card-glass p-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Free Shipping</h3>
                      <p className="text-sm text-gray-400">
                        Free standard shipping on orders over $100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-glass p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Easy Returns</h3>
                      <p className="text-sm text-gray-400">
                        30-day return policy for all products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
