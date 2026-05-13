import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'CGV — Unitree Robotics' };

const articles = [
  {
    title: 'Article 1 — Objet',
    body: "Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Unitree Robotics France SAS et tout acheteur professionnel (B2B uniquement) passant commande via ce site ou par devis.",
  },
  {
    title: 'Article 2 — Prix',
    body: "Les prix sont indiqués en euros HT. La TVA française en vigueur s'applique pour les entreprises françaises. Les prix sont susceptibles d'évoluer ; le prix applicable est celui en vigueur au moment de la confirmation de commande.",
  },
  {
    title: 'Article 3 — Commandes',
    body: "Toute commande est ferme et définitive après signature du bon de commande et versement de l'acompte. Les commandes de robots humanoïdes (H1, G1) nécessitent systématiquement un devis préalable.",
  },
  {
    title: 'Article 4 — Livraison',
    body: "Les délais de livraison sont indicatifs et communiqués lors de la confirmation de commande. Unitree Robotics France décline toute responsabilité en cas de retard imputable au transporteur ou aux douanes.",
  },
  {
    title: 'Article 5 — Garantie',
    body: "Tous les produits bénéficient d'une garantie de 12 mois pièces et main d'œuvre (hors usure normale). La garantie ne couvre pas les dommages résultant d'une mauvaise utilisation ou d'une modification non autorisée.",
  },
  {
    title: 'Article 6 — Retours',
    body: "Aucun retour n'est accepté sans accord écrit préalable. Les produits sous emballage d'origine non ouvert peuvent être retournés dans les 14 jours suivant la livraison, hors frais de transport.",
  },
  {
    title: 'Article 7 — Droit applicable',
    body: "Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence exclusive du Tribunal de Commerce de Paris.",
  },
];

export default function CgvPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Légal</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Conditions générales de vente</h1>
        <p className="mt-3 text-slate-400 dark:text-zinc-500 text-sm">Dernière mise à jour : janvier 2025 — Applicables aux ventes B2B uniquement.</p>

        <div className="mt-12 space-y-8">
          {articles.map(({ title, body }) => (
            <div key={title} className="border-b border-slate-200 dark:border-border pb-8 last:border-0">
              <h2 className="font-semibold text-white mb-3">{title}</h2>
              <p className="text-zinc-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
