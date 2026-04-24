import { Shield, Globe, Cpu, Award } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'ISO 27001 Certified', sub: 'Enterprise security' },
  { icon: Globe, label: 'EU GDPR Compliant', sub: 'Data sovereignty' },
  { icon: Cpu, label: '5+ Years R&D', sub: 'Proven robotics platform' },
  { icon: Award, label: '50+ Countries', sub: 'Global deployments' },
];

export function TrustBadges() {
  return (
    <section className="border-y border-slate-200 dark:border-white/6 bg-white dark:bg-[#06060f] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 group-hover:border-blue-300 dark:group-hover:border-blue-500/30 transition-colors">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{label}</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
