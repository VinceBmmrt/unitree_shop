import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Commande — Unitree Robotics',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#04040a]">
      <header className="border-b border-slate-200 dark:border-border px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight"
          >
            Unitree<span className="text-blue-500">.</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
            <Lock className="w-3.5 h-3.5" />
            Paiement sécurisé
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">{children}</main>
    </div>
  );
}
