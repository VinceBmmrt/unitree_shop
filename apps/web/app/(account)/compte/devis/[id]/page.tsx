'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { getQuote, acceptQuote, rejectQuote, type Quote } from '@/lib/api/account';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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

export default function QuoteDetailPage() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) router.replace('/compte/connexion');
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (!user) return;
    getQuote(id)
      .then(setQuote)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, id]);

  async function handleAccept() {
    if (!quote) return;
    setActing(true);
    try {
      await acceptQuote(quote.id);
      setQuote((q) => (q ? { ...q, status: 'ACCEPTED' } : q));
    } catch {
      alert('Action impossible. Réessayez plus tard.');
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!quote) return;
    setActing(true);
    try {
      await rejectQuote(quote.id);
      setQuote((q) => (q ? { ...q, status: 'REJECTED' } : q));
    } catch {
      alert('Action impossible. Réessayez plus tard.');
    } finally {
      setActing(false);
    }
  }

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const canAct = quote?.status === 'SENT' || quote?.status === 'VIEWED';

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/compte/devis"
            className="text-sm text-slate-500 dark:text-zinc-500 hover:text-blue-500 transition-colors"
          >
            ← Mes devis
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Devis introuvable.
          </div>
        )}

        {!loading && !error && quote && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {quote.quoteNumber}
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Soumis le{' '}
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
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[quote.status] ?? STATUS_COLORS.DRAFT}`}
              >
                {STATUS_LABELS[quote.status] ?? quote.status}
              </span>
            </div>

            {/* Items */}
            {quote.items && quote.items.length > 0 && (
              <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.05]">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Articles</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {quote.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                          {fmt(Number(item.unitPrice))} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {fmt(Number(item.unitPrice) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                {quote.totalTTC > 0 && (
                  <div className="flex justify-between px-5 py-4 border-t border-slate-100 dark:border-white/[0.05] font-semibold text-slate-900 dark:text-white text-sm">
                    <span>Total TTC</span>
                    <span>{fmt(Number(quote.totalTTC))}</span>
                  </div>
                )}
              </div>
            )}

            {/* Accept / Reject actions */}
            {canAct && (
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  disabled={acting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50 transition-colors"
                >
                  {acting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accepter le devis
                </button>
                <button
                  onClick={handleReject}
                  disabled={acting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                >
                  {acting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Refuser
                </button>
              </div>
            )}

            {quote.status === 'ACCEPTED' && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Devis accepté. Notre équipe vous contactera pour finaliser la commande.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
