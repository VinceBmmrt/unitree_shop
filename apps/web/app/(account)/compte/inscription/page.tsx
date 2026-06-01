'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function InscriptionPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError('Vous devez accepter la politique de confidentialité pour continuer.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        consentGdpr: true,
      });
      const { accessToken, user } = res.data.data;
      setUser(user, accessToken);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue. Veuillez réessayer.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/6 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white"
          >
            Unitree<span className="text-blue-500">.</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Rejoignez l&apos;écosystème Unitree
          </p>
        </div>

        <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-border rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40">
          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <a
              href={`${API_URL}/auth/google`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] text-sm font-medium text-slate-700 dark:text-zinc-300 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </a>
            <a
              href={`${API_URL}/auth/github`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] text-sm font-medium text-slate-700 dark:text-zinc-300 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#06060f] px-3 text-slate-400 dark:text-zinc-500">
                ou par email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Marie"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* GDPR consent — required by French law */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-white/[0.12] text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                J&apos;accepte la{' '}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  politique de confidentialité
                </Link>{' '}
                et les{' '}
                <Link href="/cgv" className="text-blue-600 dark:text-blue-400 hover:underline">
                  conditions générales de vente
                </Link>
                . Mes données sont traitées conformément au RGPD.
              </span>
            </label>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-blue-600/20 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Créer mon compte <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-zinc-400">
          Déjà un compte ?{' '}
          <Link
            href="/compte/connexion"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
