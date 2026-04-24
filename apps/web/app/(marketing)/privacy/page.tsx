import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politique de confidentialité — Unitree Robotics' };

const sections = [
  {
    title: '1. Responsable du traitement',
    body: 'Unitree Robotics France SAS, immatriculée au RCS de Paris, est responsable du traitement de vos données personnelles collectées via ce site.',
  },
  {
    title: '2. Données collectées',
    body: 'Nous collectons les données que vous nous fournissez directement (formulaires de contact, demandes de devis) : nom, prénom, email professionnel, société, numéro de téléphone. Nous collectons également des données de navigation (cookies analytiques) avec votre consentement.',
  },
  {
    title: '3. Finalités du traitement',
    body: 'Vos données sont utilisées pour : répondre à vos demandes commerciales, envoyer des propositions de devis personnalisées, vous informer de nos nouveaux produits (avec consentement), assurer la sécurité de notre infrastructure.',
  },
  {
    title: '4. Base légale',
    body: 'Le traitement repose sur votre consentement explicite (formulaires), l\'exécution d\'un contrat (commandes et devis), et nos intérêts légitimes (sécurité, amélioration de nos services).',
  },
  {
    title: '5. Conservation des données',
    body: 'Vos données sont conservées 3 ans après votre dernier contact pour les prospects, et 10 ans pour les données comptables liées aux commandes.',
  },
  {
    title: '6. Vos droits',
    body: 'Conformément au RGPD, vous disposez des droits d\'accès, rectification, effacement, limitation, portabilité et opposition. Exercez-les à : privacy@unitree-robotics.fr',
  },
  {
    title: '7. Cookies',
    body: 'Nous utilisons des cookies analytiques (Plausible Analytics, sans collecte d\'IP) et des cookies fonctionnels strictement nécessaires. Aucun cookie publicitaire tiers n\'est utilisé.',
  },
  {
    title: '8. Contact DPO',
    body: 'Pour toute question relative à la protection de vos données : dpo@unitree-robotics.fr',
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-white dark:bg-[#04040a] text-slate-900 dark:text-white min-h-screen pt-32 pb-32 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3">Légal</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Politique de confidentialité</h1>
        <p className="mt-3 text-slate-400 dark:text-zinc-500 text-sm">Dernière mise à jour : janvier 2025</p>

        <div className="mt-12 space-y-8">
          {sections.map(({ title, body }) => (
            <div key={title} className="border-b border-slate-200 dark:border-white/6 pb-8 last:border-0">
              <h2 className="font-semibold text-white mb-3">{title}</h2>
              <p className="text-zinc-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
