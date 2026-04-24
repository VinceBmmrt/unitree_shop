import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Cpu, Terminal, Zap, FileText } from 'lucide-react';

export const metadata: Metadata = { title: 'Documentation — Unitree Robotics' };

const sections = [
  {
    icon: BookOpen,
    title: 'Guides de démarrage',
    desc: 'Premiers pas avec votre robot Unitree.',
    links: [
      { label: 'Déballage & mise sous tension', href: '#' },
      { label: 'Configuration réseau Wi-Fi', href: '#' },
      { label: 'Premier déplacement téléopéré', href: '#' },
      { label: 'Sécurité opérateur — niveau 1', href: '#' },
    ],
  },
  {
    icon: Code2,
    title: 'SDK & APIs',
    desc: 'Intégrez vos algorithmes dans le système.',
    links: [
      { label: 'SDK Python — installation', href: '#' },
      { label: 'ROS2 Humble — workspace setup', href: '#' },
      { label: 'API REST — référence complète', href: '#' },
      { label: 'Websocket temps réel — guide', href: '#' },
    ],
  },
  {
    icon: Cpu,
    title: 'Hardware',
    desc: 'Spécifications techniques et schémas.',
    links: [
      { label: 'H1 — schéma électrique', href: '#' },
      { label: 'G1 — pinout connecteurs', href: '#' },
      { label: 'B2 — carte de contrôle', href: '#' },
      { label: 'Alimentation & batteries', href: '#' },
    ],
  },
  {
    icon: Terminal,
    title: 'Exemples de code',
    desc: 'Implémentations prêtes à l\'emploi.',
    links: [
      { label: 'Locomotion de base — Python', href: '#' },
      { label: 'Vision & SLAM — ROS2', href: '#' },
      { label: 'Manipulation avec bras Z1', href: '#' },
      { label: 'Reinforcement learning — guide', href: '#' },
    ],
  },
  {
    icon: Zap,
    title: 'Firmware & mises à jour',
    desc: 'Changelog et procédures de mise à jour.',
    links: [
      { label: 'H1 firmware v2.4 — changelog', href: '#' },
      { label: 'G1 firmware v1.8 — changelog', href: '#' },
      { label: 'Procédure OTA', href: '#' },
      { label: 'Rollback & recovery', href: '#' },
    ],
  },
  {
    icon: FileText,
    title: 'Maintenance',
    desc: 'Guides de maintenance et remplacement.',
    links: [
      { label: 'Maintenance préventive — planning', href: '#' },
      { label: 'Remplacement actionneur', href: '#' },
      { label: 'Calibrage gyroscope', href: '#' },
      { label: 'Diagnostic & codes d\'erreur', href: '#' },
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Documentation</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Documentation technique
          </h1>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 text-xl max-w-2xl">
            Guides d&apos;intégration, APIs, SDK et ressources pour les développeurs et ingénieurs robotique.
          </p>

          {/* Search bar (visual) */}
          <div className="mt-8 max-w-xl">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-300 dark:border-white/12 bg-slate-50 dark:bg-white/[0.03]">
              <svg className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-zinc-600 text-sm">Rechercher dans la documentation…</span>
            </div>
          </div>
        </div>
      </section>

      {/* Docs grid */}
      <section className="py-16 px-4 pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(({ icon: Icon, title, desc, links }) => (
            <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] hover:border-blue-500/15 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{title}</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{desc}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center justify-between text-sm text-slate-500 dark:text-zinc-400 hover:text-blue-400 transition-colors group py-1"
                    >
                      <span>{label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
