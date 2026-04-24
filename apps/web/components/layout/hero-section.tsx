'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Unités déployées' },
  { value: '30+', label: 'Pays clients' },
  { value: '99.6%', label: 'Fiabilité' },
];

const floatingCards = [
  { label: 'Vitesse max', value: '2 m/s', position: 'top-8 -right-6', delay: 0, dir: -6 },
  { label: 'Degrés de liberté', value: '23 DoF', position: 'bottom-16 -left-6', delay: 0.5, dir: 6 },
  { label: 'Charge utile', value: '3 kg', position: 'top-1/2 -translate-y-1/2 -right-10', delay: 1, dir: -4, accent: true },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#04040a]">
      {/* Radial glow behind robot */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px] pointer-events-none" />

      {/* Engineering grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scanline fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#04040a] to-transparent pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-600 dark:text-blue-300 mb-8"
            >
              <Zap className="w-3 h-3 fill-blue-500 dark:fill-blue-400 text-blue-500 dark:text-blue-400" />
              G1 &amp; H1 — Disponibles à la commande
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900 dark:text-white"
            >
              Robots&nbsp;
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500">
                humanoïdes
              </span>
              <br />
              pour&nbsp;l&apos;industrie.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-slate-500 dark:text-zinc-400 max-w-lg leading-relaxed"
            >
              Systèmes autonomes de nouvelle génération pour la recherche,
              l&apos;industrie et l&apos;exploration. Livraison en France, support technique inclus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/robots"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
              >
                Voir le catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/15 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 font-semibold text-sm transition-all hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Demander un devis
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-14 flex gap-10 border-t border-slate-200 dark:border-white/8 pt-10"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — G1 robot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Ring decorations */}
              <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-white/5" />
              <div className="absolute inset-10 rounded-full border border-blue-500/10" />
              <div className="absolute inset-[72px] rounded-full border border-blue-500/15" />

              {/* Center glow */}
              <div className="absolute inset-[80px] rounded-full bg-blue-600/10 blur-2xl" />

              {/* G1 robot image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src="https://shop.unitree.com/cdn/shop/files/1_968fd08b-9aaf-4f32-b895-5c786285ee52.jpg?v=1717575256"
                  alt="Unitree G1 Robot humanoïde"
                  width={380}
                  height={380}
                  className="object-contain drop-shadow-[0_0_80px_rgba(59,130,246,0.4)]"
                  priority
                />
              </motion.div>

              {/* Floating stat cards */}
              {floatingCards.map((card) => (
                <motion.div
                  key={card.label}
                  animate={{ y: [0, card.dir, 0] }}
                  transition={{ repeat: Infinity, duration: 4 + Math.random(), ease: 'easeInOut', delay: card.delay }}
                  className={`absolute ${card.position} ${card.accent ? 'bg-blue-600 shadow-lg shadow-blue-600/40' : 'bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-sm'} rounded-2xl px-4 py-3`}
                >
                  <p className={`text-xs ${card.accent ? 'text-blue-200' : 'text-slate-400 dark:text-zinc-500'}`}>{card.label}</p>
                  <p className={`text-lg font-bold font-display ${card.accent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{card.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
