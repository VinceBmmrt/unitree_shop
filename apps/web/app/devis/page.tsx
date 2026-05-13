import type { Metadata } from 'next';
import { QuoteRequestForm } from '@/components/product/quote-request-form';
import { apiClient } from '@/lib/api/client';

export const metadata: Metadata = {
  title: 'Demander un devis',
  description:
    'Obtenez un devis personnalisé pour nos robots humanoïdes Unitree. Notre équipe commerciale vous répond sous 48h.',
};

async function getQuotableProducts() {
  try {
    const res = await apiClient.get('/products', {
      params: { limit: 50 },
      next: { revalidate: 300 },
    });
    return res.data.data.data as any[];
  } catch {
    return [];
  }
}

export default async function DevisPage({
  searchParams,
}: {
  searchParams: { product?: string; config?: string };
}) {
  const products = await getQuotableProducts();
  const preselectedProductId = searchParams.product;
  const preselectedConfigId = searchParams.config;

  return (
    <div className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="absolute right-1/4 top-1/3 w-[400px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
            Devis
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Parlons de votre projet.
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg max-w-xl">
            Chaque déploiement est unique. Partagez votre cas d&apos;usage et notre équipe
            vous proposera une solution adaptée avec un devis sous 48h ouvrées.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              { icon: '⚡', label: 'Réponse en 48h' },
              { icon: '🔒', label: 'Sans engagement' },
              { icon: '🇫🇷', label: 'Équipe Paris' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02] text-center"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs text-slate-400 dark:text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <QuoteRequestForm
          products={products}
          preselectedProductId={preselectedProductId}
          preselectedConfigId={preselectedConfigId}
        />
      </div>
    </div>
  );
}
