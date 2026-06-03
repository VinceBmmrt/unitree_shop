'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { getQuotes, type Quote } from '@/lib/api/account';
import { FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/skeleton';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  VIEWED: 'Consulté',
  NEGOTIATING: 'En négociation',
  ACCEPTED: 'Accepté',
  REJECTED: 'Refusé',
  EXPIRED: 'Expiré',
  CONVERTED: 'Converti en commande',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400',
  SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400',
  VIEWED: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400',
  NEGOTIATING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400',
  ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400',
  EXPIRED: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400',
  CONVERTED: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export default function DevisPage() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) router.replace('/compte/connexion');
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (!user) return;
    getQuotes()
      .then((res) => setQuotes(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center" />
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/compte"
            className="text-sm text-slate-500 dark:text-zinc-500 hover:text-blue-500 transition-colors"
          >
            ← Mon compte
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">Mes devis</h1>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Impossible de charger vos devis. Réessayez plus tard.
          </div>
        )}

        {!loading && !error && quotes.length === 0 && (
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-white/[0.07] rounded-2xl">
            <FileText className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Aucun devis pour le moment.</p>
            <Link
              href="/devis"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        )}

        {!loading && !error && quotes.length > 0 && (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/compte/devis/${quote.id}`}
                className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#06060f] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {quote.quoteNumber}
                    </p>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[quote.status] ?? STATUS_COLORS.DRAFT}`}
                    >
                      {STATUS_LABELS[quote.status] ?? quote.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                    {new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {quote.validUntil && (
                      <span>
                        {' '}
                        · Valable jusqu&apos;au{' '}
                        {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {quote.totalTTC > 0 && (
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {fmt(Number(quote.totalTTC))}
                    </p>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
