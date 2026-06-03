import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/dashboard';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminDashboard />;
}
