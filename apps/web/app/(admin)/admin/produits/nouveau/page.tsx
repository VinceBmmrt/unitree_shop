'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductForm, type ProductFormValues } from '@/components/admin/product-form';
import { adminCreateProduct, type ProductPayload } from '@/lib/api/admin';

export default function NouveauProduitPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductFormValues) {
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const images = data.imageUrl ? [{ url: data.imageUrl, isPrimary: true, sortOrder: 0 }] : [];

    const payload: ProductPayload = {
      sku: data.sku,
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
      images,
      tags,
    };
    await adminCreateProduct(payload);

    router.push('/admin/produits');
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/produits"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Produits
        </Link>
        <h1 className="text-xl font-bold text-foreground mt-3">Nouveau produit</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <ProductForm onSubmit={handleSubmit} submitLabel="Créer le produit" />
      </div>
    </div>
  );
}
