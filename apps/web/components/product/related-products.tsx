import { apiClient } from '@/lib/api/client';
import { ProductCard } from './product-card';
import { Product } from '@unitree/types';

interface RelatedProductsProps {
  category: string;
  currentId: string;
}

async function fetchRelated(category: string, currentId: string): Promise<Product[]> {
  try {
    const res = await apiClient.get('/products', {
      params: { category, limit: 4, exclude: currentId },
      next: { revalidate: 600 },
    } as any);
    return (res.data?.data?.data ?? []).filter((p: Product) => p.id !== currentId).slice(0, 3);
  } catch {
    return [];
  }
}

export async function RelatedProducts({ category, currentId }: RelatedProductsProps) {
  const products = await fetchRelated(category, currentId);
  if (!products.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="font-display text-xl font-semibold">Produits similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
