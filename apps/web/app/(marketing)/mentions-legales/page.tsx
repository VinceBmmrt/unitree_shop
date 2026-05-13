import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentions légales — Unitree Robotics' };

export default function MentionsLegalesPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Légal</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Mentions légales</h1>

        <div className="mt-12 space-y-8">
          {[
            {
              title: 'Éditeur du site',
              body: 'Unitree Robotics France SAS\nCapital social : 50 000 €\nSiège social : Paris, France\nRCS Paris : XXX XXX XXX\nN° TVA intracommunautaire : FR XX XXX XXX XXX',
            },
            {
              title: 'Directeur de la publication',
              body: 'Le directeur de la publication est le Président de Unitree Robotics France SAS.',
            },
            {
              title: 'Hébergement',
              body: 'Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 1101, San Francisco, CA 94104, États-Unis.',
            },
            {
              title: 'Propriété intellectuelle',
              body: "L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite préalable est interdite.",
            },
            {
              title: 'Contact',
              body: 'Pour toute question : contact@unitree-robotics.fr',
            },
          ].map(({ title, body }) => (
            <div key={title} className="border-b border-slate-200 dark:border-border pb-8 last:border-0">
              <h2 className="font-semibold text-white mb-3">{title}</h2>
              <p className="text-zinc-400 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
