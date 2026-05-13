import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Zap, FlaskConical, Cpu, GraduationCap } from 'lucide-react';
import Image from 'next/image';

const G1ModelViewer = dynamic(
  () => import('@/components/3d/g1-model-dynamic').then((m) => ({ default: m.G1ModelViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] rounded-2xl bg-[#07071a] animate-pulse" />
    ),
  },
);

export const metadata: Metadata = {
  title: 'Unitree G1 — Plateforme de Recherche Humanoïde',
  description: 'G1 : plateforme de recherche humanoïde compacte, 23 DoF, 2 m/s. Idéale pour les équipes universitaires et les startups robotique.',
};

const specs = [
  { label: 'Hauteur', value: '1.27 m' },
  { label: 'Poids', value: '35 kg' },
  { label: 'Charge utile', value: '3 kg' },
  { label: 'Vitesse max.', value: '2 m/s' },
  { label: 'Autonomie', value: '2h' },
  { label: 'Degrés de liberté', value: '23 DoF' },
  { label: 'Processeur', value: 'NVIDIA Orin NX' },
  { label: 'Capteurs', value: 'Caméra RGB-D, IMU' },
];

const features = [
  {
    icon: FlaskConical,
    title: 'Recherche académique',
    body: 'Plateforme ouverte idéale pour les laboratoires universitaires : accès bas niveau aux actionneurs, SDK Python et ROS2.',
  },
  {
    icon: Cpu,
    title: 'NVIDIA Orin NX',
    body: 'Processeur de bord haute performance pour le traitement temps réel de la vision et des algorithmes d\'apprentissage par renforcement.',
  },
  {
    icon: Zap,
    title: 'Compact & agile',
    body: '23 degrés de liberté dans un format compact de 1,27 m, adapté aux espaces de laboratoire et aux expériences en intérieur.',
  },
  {
    icon: GraduationCap,
    title: 'Accessible & évolutif',
    body: 'Point d\'entrée abordable dans la robotique humanoïde, avec des modules d\'extension pour les bras et capteurs additionnels.',
  },
];

const gallery = [
  {
    src: 'https://www.unitree.com/images/52688de58de044358e4792a5b7c1593d_2740x1720.jpg',
    alt: 'Unitree G1 — agilité et flexibilité',
  },
  {
    src: 'https://www.unitree.com/images/a7458205b63e4ff5a501c1ae84d0988b_2740x1720.jpg',
    alt: 'Unitree G1 — environnement de laboratoire',
  },
  {
    src: 'https://www.unitree.com/images/5d03fc0c0d894b47ba7a08ec9c76a773_2740x1720.jpg',
    alt: 'Unitree G1 — manipulation',
  },
];

export default function G1Page() {
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
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-4">
              Plateforme de recherche
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              Unitree<br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">G1</span>
            </h1>
            <p className="mt-6 text-slate-500 dark:text-zinc-400 text-xl max-w-lg leading-relaxed">
              La plateforme de recherche humanoïde compacte d&apos;Unitree. 23 degrés de liberté,
              accessible et extensible, pour les laboratoires et startups robotique.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
              {[
                { value: '2 m/s', label: 'Vitesse' },
                { value: '23 DoF', label: 'Liberté' },
                { value: '1.27 m', label: 'Hauteur' },
              ].map(({ value, label }) => (
                <div key={label} className="p-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.03] text-center">
                  <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{value}</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/devis?product=unitree-g1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
              >
                Demander un devis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products/unitree-g1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-semibold"
              >
                Voir la fiche produit
              </Link>
            </div>
          </div>

          {/* 3D viewer */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/8 blur-[60px] pointer-events-none" />
            <G1ModelViewer className="w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Capacités</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Optimisé pour la recherche ouverte.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-white/[0.02] hover:border-blue-200 dark:hover:border-blue-500/20 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 w-fit mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs table */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Spécifications</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Caractéristiques techniques</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-white/[0.02] overflow-hidden">
            {specs.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-white/[0.015]'}`}
              >
                <span className="text-sm text-slate-400 dark:text-zinc-500 font-medium">{label}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Galerie</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Le G1 en action.</h2>
            <p className="mt-3 text-slate-400 dark:text-zinc-500">Agilité, précision et compacité en situation réelle.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {gallery.map(({ src, alt }) => (
              <div key={src} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 dark:border-border">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare with H1 */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-[#06060f]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-500 dark:text-zinc-500 text-sm mb-4">Besoin de plus de capacités ?</p>
          <Link
            href="/robots/h1"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            Découvrir le H1 — robot industriel full-size <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-white dark:bg-[#04040a] relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-600/8 blur-[80px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Démarrez votre projet G1.</h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-lg">Notre équipe vous aide à configurer la plateforme optimale pour votre cas d&apos;usage.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/devis?product=unitree-g1"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-semibold"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
