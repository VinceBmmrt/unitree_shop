import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, FileText, HeadphonesIcon, Shield, Zap, Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Enterprise — Unitree Robotics' };

const features = [
  { icon: Building2, title: 'Tarification volume', body: 'Remises dès 5 unités avec un account manager dédié et un contrat-cadre annuel.' },
  { icon: FileText, title: 'Facturation NET30/60', body: 'Paiement par facture avec délais de paiement entreprise standards — pas d\'avance de trésorerie.' },
  { icon: HeadphonesIcon, title: 'Support prioritaire 24/7', body: 'SLA garanti 4h pour les incidents critiques, hotline dédiée et escalade technique.' },
  { icon: Shield, title: 'Conformité & sécurité', body: 'ISO 27001, RGPD, audit de sécurité disponible, NDA standard inclus.' },
  { icon: Zap, title: 'Intégration sur site', body: 'Nos ingénieurs se déplacent pour l\'installation, la configuration et la formation de vos équipes.' },
  { icon: Users, title: 'Formation opérateur', body: 'Programmes de formation certifiants pour vos opérateurs et techniciens de maintenance.' },
];

const steps = [
  { step: '01', title: 'Évaluation', body: 'Analyse de votre cas d\'usage, environnement d\'exploitation et contraintes techniques.' },
  { step: '02', title: 'Proposition', body: 'Devis personnalisé, configuration optimale et plan de déploiement détaillé.' },
  { step: '03', title: 'Pilote', body: 'Déploiement sur site d\'un ou deux systèmes avec suivi hebdomadaire pendant 30 jours.' },
  { step: '04', title: 'Scale', body: 'Déploiement de la flotte complète avec support dédié et revue trimestrielle.' },
];

export default function EnterprisePage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/6 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Enterprise</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
              Infrastructure pour les équipes<br />qui construisent l&apos;avenir.
            </h1>
            <p className="mt-6 text-slate-500 dark:text-zinc-400 text-xl max-w-2xl leading-relaxed">
              Du programme pilote au déploiement à grande échelle, nous fournissons tout ce dont une organisation enterprise a besoin.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
              >
                Parler à notre équipe <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/12 text-slate-600 dark:text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all font-semibold"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Avantages</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Tout ce dont vous avez besoin.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:bg-white/[0.04] hover:border-blue-200 dark:border-blue-500/20 transition-all group gradient-border">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Processus</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">De l&apos;idée à la flotte opérationnelle.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="relative">
                <div className="text-5xl font-display font-bold text-white/5 mb-4">{step}</div>
                <h3 className="font-semibold text-white text-lg">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f] relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-600/8 blur-[80px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Prêt à démarrer votre programme pilote ?</h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg">Parlez à notre équipe commerciale enterprise. Premier RDV sous 48h.</p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 text-lg"
            >
              Contacter l&apos;équipe sales <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
