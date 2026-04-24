import Link from 'next/link';
import { ArrowRight, Building2, FileText, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Tailored volume pricing',
    body: 'Fleet deployments of 5+ units qualify for custom pricing and dedicated account management.',
  },
  {
    icon: FileText,
    title: 'Net 30/60 invoicing',
    body: 'Enterprise customers can pay via invoice with standard NET30 or NET60 payment terms.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 priority support',
    body: 'Dedicated technical support line, guaranteed 4-hour response SLA for critical issues.',
  },
];

export function EnterpriseSection() {
  return (
    <section className="py-28 px-4 bg-slate-50 dark:bg-[#04040a] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">
              Enterprise
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Built for teams that<br />build the future.
            </h2>
            <p className="mt-5 text-slate-500 dark:text-zinc-400 text-lg max-w-lg leading-relaxed">
              From pilot programs to full-scale deployments, we provide the commercial
              infrastructure that enterprise robotics requires.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
              >
                Talk to sales <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/enterprise"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-white/12 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-semibold"
              >
                Enterprise overview
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-blue-300 dark:hover:border-blue-500/20 transition-all group"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 h-fit shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
