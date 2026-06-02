'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { CartDrawer } from '@/components/product/cart-drawer';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  {
    label: 'Robots',
    href: '/robots',
    groups: [
      {
        title: 'Humanoïdes',
        items: [
          { label: 'Unitree H1', href: '/robots/h1' },
          { label: 'Unitree H1-2', href: '/products/unitree-h1-2' },
          { label: 'Unitree G1', href: '/robots/g1' },
        ],
      },
      {
        title: 'Quadrupèdes',
        items: [
          { label: 'Unitree B2', href: '/products/unitree-b2' },
          { label: 'Unitree B2-W', href: '/products/unitree-b2-w' },
          { label: 'Unitree Go2 Pro', href: '/products/unitree-go2-pro' },
          { label: 'Unitree Go2', href: '/products/unitree-go2' },
          { label: 'Unitree Go2 Air', href: '/products/unitree-go2-air' },
          { label: 'Unitree A1', href: '/products/unitree-a1' },
        ],
      },
      {
        title: 'Bras & Mains',
        items: [
          { label: 'Unitree Z1 Pro', href: '/products/unitree-z1-pro' },
          { label: 'Unitree Dex3-1', href: '/products/unitree-dex3-1' },
        ],
      },
    ],
  },
  { label: 'Accessoires', href: '/accessoires' },
  { label: 'Services', href: '/services' },
  { label: 'Documentation', href: '/docs' },
];

function UserMenu() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
        aria-label="Menu utilisateur"
      >
        <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials}
        </span>
        <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-zinc-300 max-w-[100px] truncate">
          {user.firstName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-56"
            >
              <div className="bg-white dark:bg-[#10101e] rounded-xl p-1.5 shadow-2xl shadow-black/20 dark:shadow-black/60 border border-slate-200 dark:border-white/[0.07]">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/[0.05] mb-1">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/compte"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Mon compte
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Administration
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { itemCount, openCart, isOpen: isCartOpen } = useCartStore();
  const { user, isInitialized, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const count = itemCount();

  useEffect(() => {
    setMounted(true);
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleMobileLogout = async () => {
    setIsMobileOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#04040a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-border shadow-lg shadow-black/10 dark:shadow-black/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display font-bold text-lg tracking-tight shrink-0 transition-colors ${
              isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'
            }`}
          >
            Unitree<span className="text-blue-500">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                {link.groups ? (
                  <div
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="flex items-center"
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors rounded-lg ${
                        isScrolled
                          ? 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-zinc-800'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                      />
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-3 py-2 text-sm transition-colors rounded-lg block ${
                      isScrolled
                        ? 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/8'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Grouped dropdown */}
                <AnimatePresence>
                  {link.groups && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="absolute top-full left-0 pt-2 z-50"
                    >
                      <div className="bg-white dark:bg-[#10101e] rounded-xl shadow-2xl shadow-black/20 dark:shadow-black/60 border border-slate-200 dark:border-white/[0.07] overflow-hidden min-w-[200px]">
                        {link.groups.map((group, gi) => (
                          <div key={group.title}>
                            {gi > 0 && (
                              <div className="mx-3 border-t border-slate-100 dark:border-white/[0.06]" />
                            )}
                            <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                              {group.title}
                            </p>
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-1.5 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                        <div className="mx-3 border-t border-slate-100 dark:border-white/[0.06]" />
                        <Link
                          href="/robots"
                          className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          Voir tout le catalogue →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Right: auth + theme + cart */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Auth area — skeleton while initializing to avoid flash */}
            {!mounted || !isInitialized ? (
              <div className="hidden md:block w-24 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.04] animate-pulse" />
            ) : user ? (
              <div className="hidden md:block">
                <UserMenu />
              </div>
            ) : (
              <Link
                href="/compte/connexion"
                className="hidden md:block text-sm px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/8 transition-colors font-medium"
              >
                Connexion
              </Link>
            )}

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
              {mounted &&
                (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </button>

            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label={`Panier (${count} articles)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && count > 0 && (
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

                {user ? (
                  <>
                    <div className="pt-2 border-t border-border/50 mt-2">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/compte"
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm"
                      >
                        Mon compte
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileOpen(false)}
                          className="block px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm"
                        >
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={handleMobileLogout}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-sm text-red-600 dark:text-red-400"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/compte/connexion"
                    onClick={() => setIsMobileOpen(false)}
                    className="block mt-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-zinc-300 text-sm font-medium text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Connexion
                  </Link>
                )}

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
