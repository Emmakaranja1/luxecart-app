import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          // Update quantity
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success(`Updated ${product.name} quantity`);
        } else {
          // Add new item
          set({ items: [...items, { product, quantity }] });
          toast.success(`Added ${product.name} to cart`);
        }
      },

      removeItem: (productId: string) => {
        const items = get().items;
        const item = items.find(i => i.product.id === productId);
        
        set({
          items: items.filter(item => item.product.id !== productId),
        });
        
        if (item) {
          toast.success(`Removed ${item.product.name} from cart`);
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 100 ? 0 : 15;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.08; // 8% tax
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShipping() + get().getTax();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
