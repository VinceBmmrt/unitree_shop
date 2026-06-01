'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, FileText, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';

export default function ComptePage() {
  const { user, isInitialized, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/compte/connexion');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 text-xs font-medium">
                <Shield className="w-3 h-3" />
                Administrateur
              </span>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/devis"
            className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
          >
            <FileText className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Demander un devis
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                Robots & configurations
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform self-end" />
          </Link>

          <Link
            href="/accessoires"
            className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
          >
            <ShoppingBag className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Boutique</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                Accessoires & pièces
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform self-end" />
          </Link>
        </div>

        {/* Profile card */}
        <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Informations du compte
            </h2>
          </div>

          <dl className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            <div className="px-6 py-4 flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <dt className="text-sm text-slate-500 dark:text-zinc-400 w-28 shrink-0">
                Nom complet
              </dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-white">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div className="px-6 py-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <dt className="text-sm text-slate-500 dark:text-zinc-400 w-28 shrink-0">Email</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</dd>
            </div>
            <div className="px-6 py-4 flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-400 shrink-0" />
              <dt className="text-sm text-slate-500 dark:text-zinc-400 w-28 shrink-0">Rôle</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Admin shortcut */}
        {user.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center justify-between w-full p-5 mb-6 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-600/15 dark:hover:bg-blue-500/15 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Accès administrateur
                </p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  Gérer les produits, devis et commandes
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Danger zone */}
        <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.05]">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Session</h2>
          </div>
          <div className="px-6 py-4">
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
            >
              Se déconnecter de ce compte
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
