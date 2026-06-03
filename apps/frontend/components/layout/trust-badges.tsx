'use client';

import { Shield, Globe, Cpu, Award, type LucideIcon } from 'lucide-react';
import { AnimateIn } from '@/components/ui/animate-in';
import { AnimatedCounter } from '@/components/ui/animated-counter';

type BadgeItem =
  | { icon: LucideIcon; label: string; sub: string; counter: false }
  | {
      icon: LucideIcon;
      label: null;
      counterTo: number;
      counterSuffix: string;
      sub: string;
      counter: true;
    };

const badges: BadgeItem[] = [
  { icon: Shield, label: 'ISO 27001 Certified', sub: 'Enterprise security', counter: false },
  { icon: Globe, label: 'EU GDPR Compliant', sub: 'Data sovereignty', counter: false },
  {
    icon: Cpu,
    label: null,
    counterTo: 5,
    counterSuffix: '+ Years R&D',
    sub: 'Proven robotics platform',
    counter: true,
  },
  {
    icon: Award,
    label: null,
    counterTo: 50,
    counterSuffix: '+ Countries',
    sub: 'Global deployments',
    counter: true,
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-slate-200 dark:border-border bg-white dark:bg-[#06060f] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <AnimateIn
              key={i}
              variant="fade-up"
              delay={i * 0.08}
              className="flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 group-hover:border-blue-300 dark:group-hover:border-blue-500/30 transition-colors">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  {badge.counter ? (
                    <AnimatedCounter
                      to={badge.counterTo}
                      suffix={badge.counterSuffix}
                      duration={1.6}
                    />
                  ) : (
                    badge.label
                  )}
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500">{badge.sub}</p>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}
