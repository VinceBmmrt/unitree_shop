'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth.store';
import { getOrder, cancelOrder, type Order } from '@/lib/api/account';
import { AlertCircle, Package, Truck, MapPin, X, Loader2 } from 'lucide-react';
import { SkeletonDetailPage } from '@/components/ui/skeleton';

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

const CANCELLABLE = ['PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING'];

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export default function OrderDetailPage() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) router.replace('/compte/connexion');
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (!user) return;
    getOrder(id)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, id]);

  async function handleCancel() {
    if (!order || !confirm('Annuler cette commande ?')) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id);
      setOrder((o) => (o ? { ...o, status: 'CANCELLED' } : o));
    } catch {
      alert("Impossible d'annuler cette commande.");
    } finally {
      setCancelling(false);
    }
  }

  if (!isInitialized || !user) {
    return <div className="min-h-screen bg-white dark:bg-[#04040a]" />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/compte/commandes"
            className="text-sm text-slate-500 dark:text-zinc-500 hover:text-blue-500 transition-colors"
          >
            ← Mes commandes
          </Link>
        </div>

        {loading && <SkeletonDetailPage cards={3} />}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Commande introuvable.
          </div>
        )}

        {!loading && !error && order && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {order.orderNumber}
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Passée le{' '}
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? STATUS_COLORS.CANCELLED}`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                {CANCELLABLE.includes(order.status) && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                  >
                    {cancelling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    Annuler
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.05]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4" /> Articles
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {order.items.map((item) => {
                  const imgUrl = item.product?.images?.[0]?.url;
                  return (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/5 shrink-0 overflow-hidden">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full p-1"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                          {fmt(Number(item.unitPrice))} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">
                        {fmt(Number(item.totalPrice))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Totals */}
              <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-5 space-y-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Récapitulatif
                </h2>
                <div className="flex justify-between text-sm text-slate-500 dark:text-zinc-400">
                  <span>Sous-total HT</span>
                  <span>{fmt(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 dark:text-zinc-400">
                  <span>TVA 20%</span>
                  <span>{fmt(Number(order.taxTotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 dark:text-zinc-400">
                  <span>Livraison</span>
                  <span>
                    {Number(order.shippingTotal) === 0
                      ? 'Offerte'
                      : fmt(Number(order.shippingTotal))}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                  <span>Total TTC</span>
                  <span>{fmt(Number(order.total))}</span>
                </div>
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Adresse de livraison
                  </h2>
                  <address className="not-italic text-sm text-slate-600 dark:text-zinc-400 space-y-0.5">
                    <p>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </address>
                </div>
              )}
            </div>

            {/* Shipment tracking */}
            {order.shipments && order.shipments.length > 0 && (
              <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Suivi
                </h2>
                {order.shipments.map((s, i) => (
                  <div key={i} className="text-sm text-slate-600 dark:text-zinc-400">
                    {s.carrier && <span className="font-medium">{s.carrier}</span>}
                    {s.trackingNumber && (
                      <span className="ml-2 font-mono text-xs bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                        {s.trackingNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
