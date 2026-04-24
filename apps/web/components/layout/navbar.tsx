'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { CartDrawer } from '@/components/product/cart-drawer';

const NAV_LINKS = [
  {
    label: 'Robots',
    href: '/robots',
    children: [
      { label: 'H1 — Humanoid', href: '/robots/h1', desc: 'Robot humanoïde autonome' },
      { label: 'G1 — Research', href: '/robots/g1', desc: 'Plateforme de recherche' },
    ],
  },
  { label: 'Accessoires', href: '/accessoires' },
  { label: 'Services', href: '/services' },
  { label: 'Documentation', href: '/docs' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { itemCount, openCart, isOpen: isCartOpen } = useCartStore();
  const { theme, setTheme } = useTheme();
  const count = itemCount();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#04040a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/8 shadow-lg shadow-black/10 dark:shadow-black/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tight shrink-0 text-slate-900 dark:text-white"
          >
            Unitree<span className="text-blue-500">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                {link.children ? (
                  <button
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100/80 dark:hover:bg-white/8"
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100/80 dark:hover:bg-white/8 block"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="glass-dark rounded-xl p-2 min-w-[220px] shadow-2xl border border-white/8">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors"
                          >
                            <span className="text-sm font-medium">{child.label}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{child.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Right: CTA + cart */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/compte/connexion"
              className="hidden md:block text-sm px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/8 transition-colors font-medium"
            >
              Connexion
            </Link>
            <Link
              href="/devis"
              className="hidden md:block text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-500/30"
            >
              Demander un devis
            </Link>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label={`Panier (${count} articles)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none"
                >
                  {count > 9 ? '9+' : count}
                </motion.span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-background"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/compte/connexion"
                  onClick={() => setIsMobileOpen(false)}
                  className="block mt-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-sm font-medium text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/devis"
                  onClick={() => setIsMobileOpen(false)}
                  className="block mt-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center"
                >
                  Demander un devis
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
