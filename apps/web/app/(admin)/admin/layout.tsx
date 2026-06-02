'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingBag,
  BarChart2,
  Users,
  Settings,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/quotes', label: 'Devis', icon: FileText },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN'))) {
      router.replace(`/compte/connexion?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isInitialized, router, pathname]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center border-b border-border">
          <Link href="/" className="font-display font-semibold text-sm">
            Unitree<span className="text-primary">.</span>
            <span className="text-muted-foreground font-normal ml-2">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {user.firstName[0]}
              {user.lastName?.[0] ?? ''}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground">v1.0 · Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
