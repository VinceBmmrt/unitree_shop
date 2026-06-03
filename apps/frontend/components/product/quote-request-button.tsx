'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  requiresQuote: boolean;
}

interface QuoteRequestButtonProps {
  product: Product;
}

export function QuoteRequestButton({ product }: QuoteRequestButtonProps) {
  if (!product.requiresQuote) return null;

  return (
    <div className="space-y-2">
      <Link
        href={`/devis?product=${product.id}`}
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90"
      >
        Demander un devis
        <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-center text-xs text-muted-foreground">
        Réponse garantie sous 48h ouvrées · Sans engagement
      </p>
    </div>
  );
}
