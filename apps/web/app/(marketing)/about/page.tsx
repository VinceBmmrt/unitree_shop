import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Cpu, Users, Award } from 'lucide-react';

export const metadata: Metadata = { title: 'À propos — Unitree Robotics' };

const milestones = [
  { year: '2016', event: 'Fondation d\'Unitree Robotics à Hangzhou, Chine.' },
  { year: '2019', event: 'Lancement du A1, premier robot quadrupède grand public à moins de 10 000 $.' },
  { year: '2021', event: 'Go1 : 200 000 unités vendues, déploiements dans 50+ pays.' },
  { year: '2022', event: 'Lancement du B1 et du Z1, bras robotique 6 DoF.' },
  { year: '2023', event: 'H1 — premier robot humanoïde full-size d\'Unitree, 3.3 m/s.' },
  { year: '2024', event: 'G1 — plateforme de recherche humanoïde compacte à 16 000 $.' },
];

const values = [
  {
    icon: Cpu,
    title: 'Ingénierie d\'abord',
    body: 'Chaque produit est conçu autour de la performance réelle, pas des benchmarks marketing. Nous publions nos données brutes.',
  },
  {
    icon: Globe,
    title: 'Accessibilité mondiale',
    body: 'Démocratiser la robotique avancée. Des robots de classe recherche accessibles aux startups et aux laboratoires.',
  },
  {
    icon: Users,
    title: 'Communauté ouverte',
    body: 'SDK open-source, documentation publique, forums actifs. La communauté est au cœur de l\'écosystème Unitree.',
  },
  {
    icon: Award,
    title: 'Support de classe enterprise',
    body: 'SLA garantis, équipes dédiées, formation sur site. Les grandes organisations ont besoin d\'un partenaire fiable.',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-blue-600/6 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto max-w-3xl">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">À propos</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Accélérer la robotique mondiale.
          </h1>
          <p className="mt-6 text-slate-500 dark:text-zinc-400 text-xl max-w-2xl leading-relaxed">
            Unitree Robotics développe des robots humanoïdes et quadrupèdes de classe mondiale, rendus accessibles à tous — chercheurs, ingénieurs, entreprises.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
              { value: '8+', label: 'Années R&D' },
              { value: '50+', label: 'Pays clients' },
              { value: '200k+', label: 'Robots déployés' },
              { value: '500+', label: 'Ingénieurs' },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] text-center">
                <p className="font-display font-bold text-2xl text-white">{value}</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Valeurs</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Ce qui nous guide.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] hover:border-blue-200 dark:border-blue-500/20 transition-all">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 w-fit mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Histoire</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">8 ans d&apos;innovation.</h2>
          </div>
          <div className="space-y-0">
            {milestones.map(({ year, event }, i) => (
              <div key={year} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-1.5 group-hover:bg-blue-400 transition-colors" />
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-white/8 mt-2" />}
                </div>
                <div className={`pb-8 ${i === milestones.length - 1 ? 'pb-0' : ''}`}>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">{year}</p>
                  <p className="text-zinc-300">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f] relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-600/8 blur-[80px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Rejoignez l&apos;aventure.</h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg">Que vous soyez chercheur, industriel ou entrepreneur, il y a une place pour vous dans l&apos;écosystème Unitree.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/robots"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
            >
              Voir nos robots <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/12 text-slate-600 dark:text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all font-semibold"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
