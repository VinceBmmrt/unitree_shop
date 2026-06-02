'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { adminUpdateProduct, type AdminProduct, type ProductPayload } from '@/lib/api/admin';
import { ProductForm, type ProductFormValues } from '@/components/admin/product-form';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditProduitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/products/admin/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: ProductFormValues) {
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;
    const images = data.imageUrl
      ? [{ url: data.imageUrl, isPrimary: true, sortOrder: 0 }]
      : undefined;

    const payload: ProductPayload = {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
      leasePriceMonth: data.leasePriceMonth ? Number(data.leasePriceMonth) : undefined,
      requiresQuote: data.requiresQuote,
      isConfigurable: data.isConfigurable,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      ...(images && { images }),
      ...(tags && { tags }),
    };
    await adminUpdateProduct(id, payload);

    router.push('/admin/produits');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
        Produit introuvable.
      </div>
    );
  }

  const defaultValues: Partial<ProductFormValues> = {
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    category: product.category,
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice ?? '',
    leasePriceMonth: product.leasePriceMonth ?? '',
    requiresQuote: product.requiresQuote,
    isConfigurable: product.isConfigurable,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    imageUrl: product.images?.[0]?.url ?? '',
    tags: product.tags?.map((t) => t.tag).join(', ') ?? '',
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/produits"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Produits
        </Link>
        <h1 className="text-xl font-bold text-foreground mt-3">{product.name}</h1>
        <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  );
}
