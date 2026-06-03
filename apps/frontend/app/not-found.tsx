import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-zinc-950">
      <div className="text-center max-w-md">
        <p className="text-6xl font-display font-bold text-slate-100 dark:text-zinc-800">404</p>
        <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-zinc-100 mt-4">
          Page introuvable
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-3 text-sm">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
