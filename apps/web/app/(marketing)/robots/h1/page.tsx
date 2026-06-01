import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Zap, Shield, Cpu, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unitree H1 — Robot Humanoïde Industriel',
  description:
    'H1 : robot humanoïde full-size, 43 DoF, 3.3 m/s, 30 kg de charge. Conçu pour les environnements industriels complexes.',
};

const specs = [
  { label: 'Hauteur', value: '1.8 m' },
  { label: 'Poids', value: '47 kg' },
  { label: 'Charge utile', value: '30 kg' },
  { label: 'Vitesse max.', value: '3.3 m/s' },
  { label: 'Autonomie', value: '2h+' },
  { label: 'Degrés de liberté', value: '43 DoF' },
  { label: 'Processeur', value: 'NVIDIA Jetson + Intel NUC' },
  { label: 'Capteurs', value: 'LiDAR 3D, RGB-D, IMU 9-axis' },
];

const features = [
  {
    icon: Zap,
    title: 'Mobilité avancée',
    body: "43 degrés de liberté et une vitesse de marche de 3,3 m/s pour naviguer dans tout type d'environnement industriel.",
  },
  {
    icon: Shield,
    title: 'Robustesse industrielle',
    body: 'Structure en alliage haute résistance, conçue pour opérer dans des conditions exigeantes : poussière, vibrations, températures extrêmes.',
  },
  {
    icon: Cpu,
    title: 'Calcul embarqué',
    body: 'Double processeur NVIDIA Jetson + Intel NUC pour un traitement temps réel de la vision, du SLAM et du contrôle moteur.',
  },
  {
    icon: Activity,
    title: 'Recherche & industrie',
    body: 'API ouverte, SDK ROS2 et accès bas niveau aux actionneurs pour des recherches en locomotion, manipulation et IA.',
  },
];

export default function H1Page() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center pt-28 pb-16">
          {/* Text */}
          <div>
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-4">
              Robot humanoïde
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              Unitree
              <br />
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                H1
              </span>
            </h1>
            <p className="mt-6 text-slate-500 dark:text-zinc-400 text-xl max-w-lg leading-relaxed">
              Le robot humanoïde full-size d&apos;Unitree. 43 degrés de liberté, 30 kg de charge
              utile, conçu pour les déploiements industriels et la recherche de pointe.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
              {[
                { value: '3.3 m/s', label: 'Vitesse' },
                { value: '43 DoF', label: 'Liberté' },
                { value: '30 kg', label: 'Charge' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.03] text-center"
                >
                  <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {value}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/devis?product=unitree-h1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
              >
                Demander un devis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products/unitree-h1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all font-semibold"
              >
                Voir la fiche produit
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full bg-blue-600/10 blur-[80px]" />
            <Image
              src="https://www.unitree.com/images/fdff7695f62b42b89b2459a3a4405118_400x400.png"
              alt="Unitree H1 — Robot humanoïde industriel"
              width={500}
              height={500}
              className="relative z-10 object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
              Capacités
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Conçu pour les cas d&apos;usage exigeants.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02] hover:border-blue-200 dark:border-blue-500/20 hover:bg-slate-100 dark:bg-white/[0.04] transition-all"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 w-fit mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs table */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
              Spécifications
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Caractéristiques techniques
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02] overflow-hidden">
            {specs.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-white/[0.015]'}`}
              >
                <span className="text-sm text-slate-400 dark:text-zinc-500 font-medium">
                  {label}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f] relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-600/8 blur-[80px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Prêt à déployer le H1 ?
          </h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg">
            Notre équipe vous accompagne de la phase pilote au déploiement à grande échelle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/devis?product=unitree-h1"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all font-semibold"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
