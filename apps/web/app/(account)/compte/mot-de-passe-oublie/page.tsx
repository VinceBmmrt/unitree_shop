'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 404) {
        // Show success even if email not found (security: don't reveal existence)
        setSent(true);
      } else {
        setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue. Veuillez réessayer.'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#04040a] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/6 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            Unitree<span className="text-blue-500">.</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Saisissez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white dark:bg-[#06060f] border border-slate-200 dark:border-border rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Email envoyé !
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Si un compte existe pour <span className="font-medium text-slate-700 dark:text-zinc-300">{email}</span>,
                vous recevrez un email avec un lien pour réinitialiser votre mot de passe dans quelques minutes.
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-3">
                Pensez à vérifier vos spams.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
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
                  <>Envoyer le lien <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-zinc-400">
          <Link href="/compte/connexion" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
