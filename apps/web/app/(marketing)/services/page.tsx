import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Wrench, GraduationCap, Settings, LifeBuoy, Truck, FlaskConical } from 'lucide-react';

export const metadata: Metadata = { title: 'Services — Unitree Robotics' };

const services = [
  {
    icon: Wrench,
    title: 'Maintenance préventive',
    body: 'Contrats de maintenance annuels avec inspection sur site, remplacement des pièces d\'usure et mises à jour firmware garanties.',
    badge: 'Annuel',
  },
  {
    icon: GraduationCap,
    title: 'Formation opérateur',
    body: 'Programmes certifiants de 2 à 5 jours pour vos opérateurs et techniciens : prise en main, sécurité, maintenance de niveau 1.',
    badge: '2–5 jours',
  },
  {
    icon: Settings,
    title: 'Intégration sur site',
    body: 'Nos ingénieurs se déplacent pour l\'installation, la configuration réseau, le calibrage et les tests d\'acceptance en production.',
    badge: 'Sur site',
  },
  {
    icon: LifeBuoy,
    title: 'Support technique',
    body: 'Hotline technique dédiée, portail de tickets prioritaire, accès remote aux logs pour diagnostic rapide.',
    badge: 'SLA 4h',
  },
  {
    icon: Truck,
    title: 'Logistique & douanes',
    body: 'Gestion complète de l\'import, dédouanement CE, transport assuré et livraison white-glove sur votre site.',
    badge: 'Clé en main',
  },
  {
    icon: FlaskConical,
    title: 'Développement custom',
    body: 'Adaptation software, développement de modules spécifiques, intégration API avec vos systèmes existants (MES, ERP, SCADA).',
    badge: 'Sur devis',
  },
];

const plans = [
  {
    name: 'Essentiel',
    desc: 'Pour les déploiements simples',
    features: ['Support email 9h–18h', 'SLA 48h ouvrées', 'Mises à jour firmware', '1 formation initiale'],
    cta: 'Inclus à l\'achat',
  },
  {
    name: 'Business',
    desc: 'Pour les équipes opérationnelles',
    features: ['Hotline dédiée 24/7', 'SLA 8h', 'Maintenance annuelle sur site', 'Formation équipe (5 pers.)', 'Accès remote diagnostics'],
    cta: 'Sur devis',
    highlight: true,
  },
  {
    name: 'Enterprise',
    desc: 'Pour les flottes et déploiements critiques',
    features: ['Account manager dédié', 'SLA 4h critique', '2 maintenances annuelles', 'Formation illimitée', 'Développement custom', 'Reporting mensuel'],
    cta: 'Contacter sales',
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-blue-600/6 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Services</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white max-w-3xl">
            Maintenance & support pour vos déploiements.
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-xl max-w-2xl">
            De l&apos;installation à la maintenance préventive, nous assurons la performance de vos systèmes Unitree dans la durée.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Catalogue</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Tous nos services.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, body, badge }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] hover:border-blue-200 dark:border-blue-500/20 hover:bg-slate-100 dark:bg-white/[0.04] transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                    {badge}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Formules</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Choisissez votre niveau de support.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(({ name, desc, features, cta, highlight }) => (
              <div
                key={name}
                className={`p-6 rounded-2xl border transition-all flex flex-col ${
                  highlight
                    ? 'border-blue-500/40 bg-blue-600/8 relative'
                    : 'border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02]'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-blue-600 text-white">Recommandé</span>
                  </div>
                )}
                <h3 className="font-display font-bold text-xl text-white">{name}</h3>
                <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1 mb-5">{desc}</p>
                <ul className="space-y-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                      : 'border border-slate-300 dark:border-white/12 text-slate-600 dark:text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
