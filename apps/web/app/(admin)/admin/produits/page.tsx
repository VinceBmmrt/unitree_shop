'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGetProducts, adminUpdateProduct, type AdminProduct } from '@/lib/api/admin';
import { Loader2, AlertCircle, Plus, Pencil, Eye, EyeOff } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  HUMANOID_ROBOT: 'Robot humanoïde',
  QUADRUPED_ROBOT: 'Robot quadrupède',
  ROBOTIC_ARM: 'Bras robotique',
  ACCESSORY: 'Accessoire',
  SPARE_PART: 'Pièce détachée',
  SOFTWARE_SUBSCRIPTION: 'Abonnement',
  SERVICE_PLAN: 'Plan service',
  PERIPHERAL: 'Périphérique',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    adminGetProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(product: AdminProduct) {
    setTogglingId(product.id);
    try {
      await adminUpdateProduct(product.id, { isActive: !product.isActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)),
      );
    } catch {
      alert('Impossible de modifier le statut.');
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau produit
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
          Impossible de charger les produits.
        </div>
      )}

      {!loading && !error && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-5 py-3">Produit</th>
                <th className="text-left px-5 py-3">Catégorie</th>
                <th className="text-left px-5 py-3">Prix</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-sm">
                    Aucun produit.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-muted/30 transition-colors ${!product.isActive ? 'opacity-50' : ''}`}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {fmt(Number(product.basePrice))}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.requiresQuote && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400">
                          Devis
                        </span>
                      )}
                      {product.isConfigurable && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400">
                          Config
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">
                          Vedette
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(product)}
                      disabled={togglingId === product.id}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {togglingId === product.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : product.isActive ? (
                        <Eye className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
