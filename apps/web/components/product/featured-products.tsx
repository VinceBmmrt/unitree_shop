'use client';

import { ProductCard } from './product-card';

interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  basePrice: number;
  compareAtPrice?: number;
  leasePriceMonth?: number;
  category: string;
  isFeatured?: boolean;
  requiresQuote?: boolean;
  images?: { url: string; altText?: string }[];
  tags?: { tag: string }[];
  inStock?: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No featured products available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          name={product.name}
          shortDescription={product.shortDescription}
          basePrice={product.basePrice}
          compareAtPrice={product.compareAtPrice}
          leasePriceMonth={product.leasePriceMonth}
          category={product.category}
          requiresQuote={product.requiresQuote ?? false}
          inStock={product.inStock ?? true}
          image={product.images?.[0]}
          tags={product.tags}
        />
      ))}
    </div>
  );
}
