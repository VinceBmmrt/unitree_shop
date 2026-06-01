import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/layout/hero-section';
import { FeaturedProducts } from '@/components/product/featured-products';
import { TrustBadges } from '@/components/layout/trust-badges';
import { SpecsComparison } from '@/components/product/specs-comparison';
import { EnterpriseSection } from '@/components/layout/enterprise-section';
import { apiClient } from '@/lib/api/client';

export const metadata: Metadata = {
  title: 'Unitree Robotics — Advanced Humanoid Robots',
};

// ISR: revalidate every 5 minutes — product prices/availability changes
export const revalidate = 300;

async function getFeaturedProducts() {
  try {
    const res = await apiClient.get('/products', {
      params: { isFeatured: true, limit: 6 },
      next: { revalidate: 300 },
    });
    return res.data.data.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <HeroSection />

      <TrustBadges />

      <section className="py-28 px-4 bg-white dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
              Catalogue
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for what comes next.
            </h2>
            <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Every system engineered to operate at the edge of what&apos;s possible — in labs, on
              factory floors, and beyond.
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProducts products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      <SpecsComparison />
      <EnterpriseSection />
    </main>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}
