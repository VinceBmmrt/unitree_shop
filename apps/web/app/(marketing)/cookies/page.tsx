import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gestion des cookies — Unitree Robotics' };

const cookies = [
  {
    name: 'Cookies fonctionnels',
    required: true,
    desc: 'Nécessaires au fonctionnement du site : session panier, préférences de langue, authentification. Ne peuvent pas être désactivés.',
    examples: 'cart_session, theme_preference',
  },
  {
    name: 'Cookies analytiques',
    required: false,
    desc: 'Nous utilisons Plausible Analytics (sans collecte IP, sans traceur cross-site) pour mesurer le trafic de manière anonyme et améliorer nos contenus.',
    examples: 'plausible_*',
  },
  {
    name: 'Cookies tiers',
    required: false,
    desc: 'Aucun cookie publicitaire ou de réseaux sociaux n\'est chargé par défaut. Des vidéos YouTube peuvent être intégrées — elles chargent leurs propres cookies si vous acceptez.',
    examples: 'Aucun par défaut',
  },
];

export default function CookiesPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Légal</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Gestion des cookies</h1>
        <p className="mt-3 text-slate-400 dark:text-zinc-500 text-sm">Conformément à la réglementation CNIL et à la directive ePrivacy.</p>

        <p className="mt-8 text-slate-500 dark:text-zinc-400 leading-relaxed">
          Ce site utilise un nombre minimal de cookies. Nous respectons votre vie privée et ne collectons que ce qui est strictement nécessaire au bon fonctionnement de la plateforme ou à l&apos;amélioration de votre expérience avec votre consentement explicite.
        </p>

        <div className="mt-12 space-y-6">
          {cookies.map(({ name, required, desc, examples }) => (
            <div key={name} className="p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-white">{name}</h2>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${required ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25' : 'bg-white/5 text-slate-500 dark:text-zinc-400 border border-white/10'}`}>
                  {required ? 'Obligatoire' : 'Optionnel'}
                </span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              <p className="mt-3 text-xs text-zinc-600 font-mono">Exemples : {examples}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-blue-600/5">
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Pour exercer vos droits ou retirer votre consentement analytique, contactez-nous à{' '}
            <span className="text-blue-400">privacy@unitree-robotics.fr</span>
          </p>
        </div>
      </div>
    </main>
  );
}
