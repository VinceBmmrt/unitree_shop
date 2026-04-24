import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingBag,
  BarChart2,
  Users,
  Settings,
} from 'lucide-react';

export const metadata: Metadata = { title: { template: '%s — Admin', default: 'Admin' } };

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
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">v1.0 · Unitree Robotics</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
