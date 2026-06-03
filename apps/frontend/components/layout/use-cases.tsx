'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';

interface UseCase {
  image: string;
  sector: string;
  title: string;
  description: string;
  href: string;
  colSpan: 1 | 2 | 3;
  minHeight: string;
  objectPosition?: string;
}

const cases: UseCase[] = [
  {
    image: '/images/robot-warehouse-logistics.png',
    sector: 'Intralogistique',
    title: 'Automate your supply chain',
    description:
      'Picking, sorting, and autonomous delivery across multi-level distribution centers — continuous operation, zero downtime.',
    href: '/services',
    colSpan: 2,
    minHeight: 'min-h-[420px]',
    objectPosition: '50% 30%',
  },
  {
    image: '/images/robot-nuclear-fuel-fabrication.webp',
    sector: 'Environnements hostiles',
    title: 'Where humans cannot go',
    description:
      'Radiation zones, chemical plants, extreme heat — full dexterity in environments hostile to human operators.',
    href: '/services',
    colSpan: 1,
    minHeight: 'min-h-[420px]',
    objectPosition: '60% 20%',
  },
  {
    image: '/images/robot-healthcare-corridor.png',
    sector: 'Santé & assistance',
    title: 'Care that never stops',
    description:
      'Medication rounds, mobility support, and 24/7 facility assistance — deployed in care homes across France.',
    href: '/services',
    colSpan: 1,
    minHeight: 'min-h-[360px]',
    objectPosition: '40% 15%',
  },
  {
    image: '/images/robot-quality-control.png',
    sector: 'Contrôle qualité',
    title: 'Precision at the line',
    description:
      'Visual inspection, component sorting, and defect detection integrated directly into production flows.',
    href: '/services',
    colSpan: 2,
    minHeight: 'min-h-[360px]',
    objectPosition: '50% 20%',
  },
  {
    image: '/images/robot-security-patrol.png',
    sector: 'Sécurité & surveillance',
    title: '24/7 autonomous patrol',
    description:
      'Night rounds, intrusion detection, and real-time incident reporting across industrial sites — no shift limits.',
    href: '/services',
    colSpan: 3,
    minHeight: 'min-h-[300px]',
    objectPosition: '50% 35%',
  },
];

const colSpanClass: Record<1 | 2 | 3, string> = {
  1: 'col-span-1',
  2: 'col-span-1 md:col-span-2',
  3: 'col-span-1 md:col-span-3',
};

export function UseCases() {
  return (
    <section className="py-24 px-4 bg-slate-950 dark:bg-[#03030a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <AnimateIn variant="fade-up" className="text-center mb-14">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
            Déploiements
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08]">
            Designed for every environment.
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From logistics floors to radiation zones — deployed where the work is hardest.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {cases.map((c, i) => (
            <AnimateIn
              key={c.sector}
              variant="scale"
              delay={i * 0.07}
              className={`${colSpanClass[c.colSpan]} ${c.minHeight} relative overflow-hidden rounded-2xl group`}
            >
              {/* Clickable overlay */}
              <Link href={c.href} className="absolute inset-0 z-10" aria-label={c.title} />

              {/* Background image */}
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                style={{ objectPosition: c.objectPosition ?? '50% 50%' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />

              {/* Gradient overlay — darker at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/75" />

              {/* Top-right arrow indicator */}
              <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>

              {/* Text content */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col gap-2">
                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-white/10 border border-white/15 text-white/75 backdrop-blur-sm">
                  {c.sector}
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-zinc-300/90 leading-relaxed max-w-lg">{c.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
