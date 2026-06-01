'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-green-500/10 dark:bg-green-500/15 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Commande confirmée !
      </h1>
      <p className="text-slate-500 dark:text-zinc-400 mb-1">
        Merci pour votre commande. Vous recevrez une confirmation par email.
      </p>
      {orderId && (
        <p className="text-sm text-slate-400 dark:text-zinc-500 mb-8 font-mono">
          Référence : {orderId}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/compte/commandes"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Package className="w-4 h-4" />
          Voir mes commandes
        </Link>
        <Link
          href="/accessoires"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-transparent text-slate-700 dark:text-zinc-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
