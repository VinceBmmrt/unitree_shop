import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = { title: 'Contact — Unitree Robotics' };

export default function ContactPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4 relative overflow-hidden">
      <div className="absolute right-0 top-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
            Contact
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Parlons de votre projet.
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg">
            Notre équipe commerciale répond sous 24h ouvrées. Pour une demande de devis, utilisez
            directement notre formulaire dédié.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Mail, label: 'Email commercial', value: 'sales@unitree-robotics.fr' },
              { icon: Phone, label: 'Téléphone', value: '+33 1 XX XX XX XX' },
              { icon: MapPin, label: 'Siège social', value: 'Paris, France' },
              { icon: Clock, label: 'Horaires', value: 'Lun–Ven, 9h–18h CET' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex gap-4 p-5 rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02] hover:border-blue-200 dark:border-blue-500/20 hover:bg-slate-100 dark:bg-white/[0.04] transition-all"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 h-fit shrink-0">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
                    {label}
                  </p>
                  <p className="text-sm font-semibold mt-0.5 text-slate-700 dark:text-zinc-200">
                    {value}
                  </p>
                </div>
              </div>
            ))}

            <Link
              href="/devis"
              className="flex items-center justify-between p-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/20"
            >
              <div>
                <p className="font-semibold">Demande de devis</p>
                <p className="text-sm text-blue-200 mt-0.5">Réponse garantie sous 48h ouvrées</p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </Link>
          </div>

          {/* Contact form */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02]">
            <p className="font-semibold text-white mb-6">Message général</p>
            <div className="space-y-4">
              {['Nom complet', 'Email professionnel', 'Société'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-slate-400 dark:text-zinc-500 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-border bg-slate-100 dark:bg-white/[0.04] text-sm text-slate-700 dark:text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition"
                    placeholder={label}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-400 dark:text-zinc-500 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-border bg-slate-100 dark:bg-white/[0.04] text-sm text-slate-700 dark:text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>
              <button className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-600/20">
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
