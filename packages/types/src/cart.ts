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

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
  hasQuoteItems: () => boolean;
}
