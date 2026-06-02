import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { apiClient } from '@/lib/api/client';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { ProductActions } from '@/components/product/product-actions';
import { Product3DViewer } from '@/components/3d/product-3d-viewer';
import { ProductReviews } from '@/components/product/product-reviews';
import { RelatedProducts } from '@/components/product/related-products';

interface Props {
  params: { slug: string };
}

// Generate static pages for all active products at build time
export async function generateStaticParams() {
  try {
    const res = await apiClient.get('/products', { params: { limit: 200 } });
    return res.data.data.data.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await apiClient.get(`/products/${params.slug}`);
    const product = res.data.data;
    return {
      title: product.name,
      description: product.shortDescription,
      openGraph: {
        title: product.name,
        description: product.shortDescription,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

// ISR — product pages revalidate every 10 minutes
export const revalidate = 600;

async function getProduct(slug: string) {
  try {
    const res = await apiClient.get(`/products/${slug}`, {
      next: { revalidate: 600 },
    });
    return res.data.data;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    image: product.images?.map((img: { url: string }) => img.url) ?? [],
    brand: { '@type': 'Brand', name: 'Unitree Robotics' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.basePrice,
      availability: product.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Unitree Robotics France' },
    },
    ...(product.avgRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.avgRating,
            reviewCount: product.reviews?.length ?? 0,
          },
        }
      : {}),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left: Visual */}
        <div className="space-y-4">
          {product.modelUrl ? (
            <Suspense fallback={<div className="h-[500px] bg-muted rounded-2xl animate-pulse" />}>
              <Product3DViewer modelUrl={product.modelUrl} modelFormat={product.modelFormat} />
            </Suspense>
          ) : (
            <ProductGallery images={product.images} />
          )}
        </div>

        {/* Right: Info + CTA */}
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />

          <ProductActions product={product} />
        </div>
      </div>

      {/* Specs & Reviews */}
      <div className="border-t border-border pt-16 space-y-16">
        <ProductReviews reviews={product.reviews} avgRating={product.avgRating} />
        <Suspense fallback={null}>
          <RelatedProducts category={product.category} currentId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
