import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  label?: string;
}

export function ComingSoon({ title, description, label = 'Page' }: ComingSoonProps) {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto mb-16">
        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
          {label}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-xl text-lg">
          {description}
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center py-24 border border-dashed border-slate-200 dark:border-border rounded-2xl bg-slate-50 dark:bg-white/[0.02]">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 rounded bg-blue-200 dark:bg-blue-500/40" />
          </div>
          <p className="text-slate-700 dark:text-zinc-300 font-medium">Bientôt disponible</p>
          <p className="text-slate-400 dark:text-zinc-600 text-sm mt-2">
            Cette section est en cours de construction.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Retour à l&apos;accueil <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
