import Link from 'next/link';

const LINKS = {
  Produits: [
    { href: '/robots/h1', label: 'H1 Humanoid' },
    { href: '/robots/g1', label: 'G1 Research' },
    { href: '/accessoires', label: 'Accessoires' },
    { href: '/services', label: 'Services' },
  ],
  Entreprise: [
    { href: '/devis', label: 'Demander un devis' },
    { href: '/docs', label: 'Documentation' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
  Légal: [
    { href: '/privacy', label: 'Politique de confidentialité' },
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/cgv', label: 'Conditions générales' },
    { href: '/cookies', label: 'Gestion des cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/8 bg-white dark:bg-[#04040a] mt-0">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Unitree<span className="text-blue-500">.</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-3 max-w-xs leading-relaxed">
              Robots humanoïdes et systèmes autonomes pour les applications exigeantes.
            </p>
            <p className="text-xs text-slate-400 dark:text-zinc-600 mt-4">
              Paris, France · RGPD compliant
            </p>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-600 mb-4">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-white/6 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Unitree Robotics France. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-600">
            TVA FR — Siège social : Paris, France
          </p>
        </div>
      </div>
    </footer>
  );
}
