'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import type { Product } from '@unitree/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (product.requiresQuote || product.inStock === false) return null;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: product.basePrice,
      quantity: 1,
      imageUrl: product.images?.[0]?.url,
      requiresQuote: false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 disabled:opacity-80 disabled:cursor-default"
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Ajouté au panier
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Ajouter au panier
        </>
      )}
    </button>
  );
}
