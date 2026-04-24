import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { FeaturedProducts } from '@/components/product/featured-products';

export const metadata: Metadata = { title: 'Accessoires — Unitree Robotics' };
export const revalidate = 300;

async function getProducts() {
  try {
    const res = await apiClient.get('/products', {
      params: { category: 'ACCESSORY', limit: 20 },
    });
    return res.data.data.data ?? [];
  } catch {
    return [];
  }
}

export default async function AccessoiresPage() {
  const products = await getProducts();

  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
            Accessoires
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pièces & accessoires
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-xl text-lg">
            Composants certifiés, capteurs et kits d&apos;extension pour vos systèmes Unitree.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-32">
        {products.length > 0 ? (
          <FeaturedProducts products={products} />
        ) : (
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-white/8 rounded-2xl bg-slate-50 dark:bg-white/[0.02]">
            <p className="text-zinc-400 text-lg">Aucun accessoire disponible pour le moment.</p>
            <p className="text-zinc-600 text-sm mt-2">Notre catalogue s&apos;enrichit régulièrement. Contactez-nous pour vos besoins spécifiques.</p>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              Contacter notre équipe <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
