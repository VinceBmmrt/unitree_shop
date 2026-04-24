'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const robots = [
  { name: 'H1', height: '1.8m', weight: '47kg', payload: '30kg', speed: '3.3 m/s', battery: '2h+', dof: '43 DoF', price: 'Sur devis', href: '/products/unitree-h1' },
  { name: 'G1', height: '1.27m', weight: '35kg', payload: '3kg', speed: '2 m/s', battery: '2h', dof: '23 DoF', price: 'Sur devis', href: '/products/unitree-g1' },
  { name: 'B2', height: '0.65m', weight: '60kg', payload: '40kg', speed: '6 m/s', battery: '4h', dof: '12 DoF', price: 'Sur devis', href: '/products/unitree-b2' },
];

const specs = [
  { key: 'height', label: 'Hauteur' },
  { key: 'weight', label: 'Poids' },
  { key: 'payload', label: 'Charge utile' },
  { key: 'speed', label: 'Vitesse max.' },
  { key: 'battery', label: 'Autonomie' },
  { key: 'dof', label: 'Degrés de liberté' },
  { key: 'price', label: 'Tarif' },
];

export function SpecsComparison() {
  return (
    <section className="py-28 px-4 bg-white dark:bg-[#04040a] relative overflow-hidden">
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
            Comparatif
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Le bon système pour votre usage.
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/8">
                <th className="text-left px-6 py-5 text-slate-400 dark:text-zinc-600 font-normal text-sm w-44">
                  Spécification
                </th>
                {robots.map((r) => (
                  <th key={r.name} className="px-6 py-5 text-center">
                    <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{r.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map(({ key, label }, i) => (
                <tr key={key} className={`border-b border-slate-100 dark:border-white/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/80 dark:bg-white/[0.015]'}`}>
                  <td className="px-6 py-4 text-sm text-slate-400 dark:text-zinc-500 font-medium">{label}</td>
                  {robots.map((r) => (
                    <td key={r.name} className="px-6 py-4 text-center font-semibold text-sm text-slate-700 dark:text-zinc-200">
                      {r[key as keyof typeof r] === 'Sur devis' ? (
                        <span className="text-blue-600 dark:text-blue-400">Sur devis</span>
                      ) : (
                        r[key as keyof typeof r]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-slate-50 dark:bg-white/[0.02]">
                <td className="px-6 py-5 text-sm text-slate-400 dark:text-zinc-600">Voir la fiche</td>
                {robots.map((r) => (
                  <td key={r.name} className="px-6 py-5 text-center">
                    <Link
                      href={r.href}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors"
                    >
                      Détails <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
