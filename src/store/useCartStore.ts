import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, cartQuantity: item.cartQuantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, cartQuantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, cartQuantity: Math.max(1, quantity) } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.cartQuantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.cartQuantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
