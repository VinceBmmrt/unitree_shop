import type { Metadata } from 'next';
import { QuotesPipeline } from '@/components/admin/quotes-pipeline';

export const metadata: Metadata = { title: 'Devis — Admin' };
// No cache — admin views must always be fresh
export const dynamic = 'force-dynamic';

export default function AdminQuotesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Pipeline devis</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les demandes entrantes, négociez, envoyez les offres.
        </p>
      </div>
      <QuotesPipeline />
    </div>
  );
}
