'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { getOrders, type Order } from '@/lib/api/account';
import { Loader2, Package, ChevronRight, AlertCircle } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'En attente de paiement',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400',
  REFUNDED: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export default function CommandesPage() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) router.replace('/compte/connexion');
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (!user) return;
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">Mes commandes</h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Impossible de charger vos commandes. Réessayez plus tard.
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-white/[0.07] rounded-2xl">
            <Package className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Aucune commande pour le moment.
            </p>
            <Link
              href="/accessoires"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Explorer les accessoires
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/compte/commandes/${order.id}`}
                className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#06060f] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? STATUS_COLORS.CANCELLED}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' · '}
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {fmt(Number(order.total))}
                  </p>
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
