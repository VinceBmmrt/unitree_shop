import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  configurationId?: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  requiresQuote: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Derived
  itemCount: () => number;
  subtotal: () => number;
  hasQuoteItems: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const key = item.configurationId ?? `${item.productId}:${item.variantId ?? 'base'}`;
          const existing = state.items.find(
            (i) =>
              (i.configurationId && i.configurationId === item.configurationId) ||
              (!i.configurationId &&
                i.productId === item.productId &&
                i.variantId === item.variantId),
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, id: `${key}-${Date.now()}` },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      hasQuoteItems: () => get().items.some((i) => i.requiresQuote),
    }),
    {
      name: 'unitree-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
