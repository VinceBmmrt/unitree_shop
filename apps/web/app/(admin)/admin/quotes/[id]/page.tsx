'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  ArrowRightCircle,
  Save,
} from 'lucide-react';
import {
  adminGetQuote,
  adminUpdateQuote,
  adminConvertQuote,
  type AdminQuote,
} from '@/lib/api/admin';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  DRAFT: { label: 'Brouillon', color: 'text-zinc-500', bg: 'bg-zinc-500/10', icon: Clock },
  SENT: { label: 'Envoyé', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Send },
  VIEWED: { label: 'Consulté', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: RefreshCw },
  NEGOTIATING: {
    label: 'Négociation',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    icon: RefreshCw,
  },
  ACCEPTED: { label: 'Accepté', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  REJECTED: { label: 'Refusé', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
  EXPIRED: { label: 'Expiré', color: 'text-zinc-400', bg: 'bg-zinc-400/10', icon: Clock },
  CONVERTED: {
    label: 'Converti',
    color: 'text-primary',
    bg: 'bg-primary/10',
    icon: ArrowRightCircle,
  },
};

const EDITABLE_STATUSES = ['DRAFT', 'SENT', 'VIEWED', 'NEGOTIATING', 'ACCEPTED'];

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function AdminQuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quote, setQuote] = useState<AdminQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Editable fields
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validUntil, setValidUntil] = useState('');

  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetQuote(id)
      .then((q) => {
        setQuote(q);
        setStatus(q.status);
        setNotes(q.notes ?? '');
        setInternalNotes(q.internalNotes ?? '');
        setDiscount(Number(q.discount));
        setValidUntil(q.validUntil ? q.validUntil.slice(0, 10) : '');
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await adminUpdateQuote(id, {
        status,
        notes,
        internalNotes,
        discount,
        validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // Refresh quote data
      const updated = await adminGetQuote(id);
      setQuote(updated);
      setStatus(updated.status);
    } catch {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert() {
    if (!confirm('Convertir ce devis en commande confirmée ?')) return;
    setConverting(true);
    try {
      const order = await adminConvertQuote(id);
      router.push(`/admin/commandes`);
      alert(`Commande créée : ${order.orderNumber}`);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erreur lors de la conversion.');
    } finally {
      setConverting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
        Devis introuvable.
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = statusCfg.icon;
  const isTerminal = !EDITABLE_STATUSES.includes(quote.status);
  const isExpired = new Date(quote.validUntil) < new Date();

  const subtotal = Number(quote.subtotal);
  const discountAmt = discount;
  const taxTotal = (subtotal - discountAmt) * 0.2;
  const total = subtotal - discountAmt + taxTotal;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/quotes"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Devis
          </Link>
          <h1 className="text-xl font-bold text-foreground font-mono">{quote.quoteNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">Créé le {fmtDate(quote.createdAt)}</p>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusCfg.color} ${statusCfg.bg}`}
        >
          <StatusIcon className="w-4 h-4" />
          {statusCfg.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Client</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Nom</p>
                <p className="font-medium">
                  {quote.customer.firstName} {quote.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Email</p>
                <a
                  href={`mailto:${quote.customer.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {quote.customer.email}
                </a>
              </div>
              {quote.customer.phone && (
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Téléphone</p>
                  <p>{quote.customer.phone}</p>
                </div>
              )}
              {quote.orders.length > 0 && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Commande(s) associée(s)</p>
                  <div className="flex flex-wrap gap-2">
                    {quote.orders.map((o) => (
                      <Link
                        key={o.id}
                        href={`/admin/commandes/${o.id}`}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {o.orderNumber}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Produits</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Produit</th>
                  <th className="text-right px-5 py-3">Qté</th>
                  <th className="text-right px-5 py-3">Prix unitaire</th>
                  <th className="text-right px-5 py-3">Remise</th>
                  <th className="text-right px-5 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 italic">{item.notes}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">{item.quantity}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {fmt(Number(item.unitPrice))}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                      {Number(item.discount) > 0 ? `-${fmt(Number(item.discount))}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">
                      {fmt(Number(item.totalPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Notes</h2>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Notes client (visibles par le client)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isTerminal}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Notes internes (non visibles par le client)
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                disabled={isTerminal}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right — actions + summary */}
        <div className="space-y-5">
          {/* Pricing summary */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total HT</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Remise globale</span>
                <span className="text-red-500">-{fmt(discountAmt)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>TVA 20%</span>
                <span>{fmt(taxTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
                <span>Total TTC</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isTerminal && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Actions</h2>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {EDITABLE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s]?.label ?? s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Remise globale (€ HT)
                </label>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Valide jusqu'au
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                {isExpired && <p className="text-xs text-red-500 mt-1">Ce devis est expiré.</p>}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saved ? 'Sauvegardé !' : 'Sauvegarder'}
              </button>

              {quote.status === 'ACCEPTED' && (
                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50 transition-colors"
                >
                  {converting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRightCircle className="w-4 h-4" />
                  )}
                  Convertir en commande
                </button>
              )}
            </div>
          )}

          {isTerminal && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-muted-foreground text-center">
                Ce devis est en statut terminal ({statusCfg.label}) — aucune modification possible.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
