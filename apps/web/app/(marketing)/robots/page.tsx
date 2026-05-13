import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { FeaturedProducts } from '@/components/product/featured-products';

export const metadata: Metadata = { title: 'Robots — Unitree Robotics' };
export const revalidate = 300;

const STATIC_ROBOTS = [
  {
    id: 'unitree-g1',
    slug: 'unitree-g1',
    name: 'Unitree G1',
    shortDescription: 'Plateforme de recherche humanoïde compacte — 23 DoF, 2 m/s, NVIDIA Orin NX.',
    basePrice: 0,
    category: 'HUMANOID_ROBOT',
    requiresQuote: true,
    inStock: true,
    images: [{ url: 'https://shop.unitree.com/cdn/shop/files/1_968fd08b-9aaf-4f32-b895-5c786285ee52.jpg?v=1717575256', altText: 'Unitree G1' }],
    tags: [{ tag: 'Recherche' }, { tag: '23 DoF' }],
  },
  {
    id: 'unitree-h1',
    slug: 'unitree-h1',
    name: 'Unitree H1',
    shortDescription: 'Robot humanoïde industriel full-size — 43 DoF, 3.3 m/s, 30 kg de charge utile.',
    basePrice: 0,
    category: 'HUMANOID_ROBOT',
    requiresQuote: true,
    inStock: true,
    images: [{ url: 'https://www.unitree.com/images/fdff7695f62b42b89b2459a3a4405118_400x400.png', altText: 'Unitree H1' }],
    tags: [{ tag: 'Industriel' }, { tag: '43 DoF' }],
  },
];

async function getProducts(category?: string) {
  try {
    const res = await apiClient.get('/products', {
      params: { category, limit: 20, isActive: true },
    });
    const data = res.data.data.data ?? [];
    return data.length > 0 ? data : STATIC_ROBOTS;
  } catch {
    return STATIC_ROBOTS;
  }
}

const CATEGORIES = [
  { key: undefined, label: 'Tous' },
  { key: 'HUMANOID_ROBOT', label: 'Humanoïdes' },
  { key: 'QUADRUPED_ROBOT', label: 'Quadrupèdes' },
  { key: 'ROBOTIC_ARM', label: 'Bras robotiques' },
];

export default async function RobotsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const products = await getProducts(category);

  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
            Catalogue
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nos robots
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-xl text-lg">
            Systèmes autonomes de nouvelle génération pour la recherche, l&apos;industrie et l&apos;exploration.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ key, label }) => (
            <Link
              key={label}
              href={key ? `/robots?category=${key}` : '/robots'}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                category === key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 dark:border-white/[0.08] text-slate-500 dark:text-zinc-400 hover:border-blue-500/50 hover:text-blue-400'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {products.length > 0 ? (
          <FeaturedProducts products={products} />
        ) : (
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-border rounded-2xl bg-slate-50 dark:bg-white/[0.02]">
            <p className="text-zinc-400 text-lg">Aucun produit disponible pour le moment.</p>
            <p className="text-zinc-600 text-sm mt-2">Revenez bientôt ou contactez notre équipe commerciale.</p>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
