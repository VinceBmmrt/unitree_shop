'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { adminUpdateOrderStatus } from '@/lib/api/admin';
import { Loader2, AlertCircle, Package, MapPin } from 'lucide-react';

const STATUSES = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Paiement en attente',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    try {
      await adminUpdateOrderStatus(id, newStatus);
      setOrder((o: any) => ({ ...o, status: newStatus }));
    } catch {
      alert('Impossible de mettre à jour le statut.');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/commandes"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Commandes
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
          Commande introuvable.
        </div>
      )}

      {!loading && !error && order && (
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-foreground">{order.orderNumber}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {order.user?.firstName} {order.user?.lastName} · {order.user?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              {updating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Items */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" /> Articles ({order.items?.length})
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.sku} · {fmt(Number(item.unitPrice))} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {fmt(Number(item.totalPrice))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
                <h2 className="text-sm font-semibold text-foreground mb-3">Récapitulatif</h2>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sous-total HT</span>
                  <span>{fmt(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>TVA</span>
                  <span>{fmt(Number(order.taxTotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Livraison</span>
                  <span>
                    {Number(order.shippingTotal) === 0
                      ? 'Offerte'
                      : fmt(Number(order.shippingTotal))}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                  <span>Total TTC</span>
                  <span>{fmt(Number(order.total))}</span>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Livraison
                  </h2>
                  <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                    <p>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                  </address>
                </div>
              )}
            </div>
          </div>

          {/* Status history */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Historique</h2>
              <ol className="space-y-3">
                {order.statusHistory.map((h: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {STATUS_LABELS[h.status] ?? h.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {h.note && ` · ${h.note}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
