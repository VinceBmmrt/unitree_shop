'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Send,
  ArrowRightCircle,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  DRAFT: { label: 'Brouillon', color: 'text-muted-foreground', icon: Clock },
  SENT: { label: 'Envoyé', color: 'text-blue-500', icon: Send },
  VIEWED: { label: 'Consulté', color: 'text-yellow-500', icon: RefreshCw },
  NEGOTIATING: { label: 'Négociation', color: 'text-orange-500', icon: RefreshCw },
  ACCEPTED: { label: 'Accepté', color: 'text-green-500', icon: CheckCircle },
  REJECTED: { label: 'Refusé', color: 'text-red-500', icon: XCircle },
  EXPIRED: { label: 'Expiré', color: 'text-muted-foreground', icon: Clock },
  CONVERTED: { label: 'Converti', color: 'text-primary', icon: ArrowRightCircle },
};

const PIPELINE_COLUMNS = [
  { status: 'DRAFT', label: 'Nouveau' },
  { status: 'SENT', label: 'Envoyé' },
  { status: 'NEGOTIATING', label: 'Négociation' },
  { status: 'ACCEPTED', label: 'Accepté' },
];

export function QuotesPipeline() {
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [view, setView] = useState<'pipeline' | 'table'>('table');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'quotes', search],
    queryFn: async () => {
      const res = await apiClient.get('/quotes', {
        params: { limit: 100, search: search || undefined },
      });
      return res.data.data;
    },
    refetchInterval: 30_000,
  });

  const sendMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await apiClient.patch(`/quotes/${quoteId}`, { status: 'SENT' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await apiClient.post(`/quotes/${quoteId}/convert`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
    },
  });

  const quotes: any[] = data?.data ?? [];

  const formatEur = (n: any) =>
    Number(n).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par client, numéro..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            Liste
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`px-3 py-2 transition-colors ${view === 'pipeline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            Pipeline
          </button>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">{quotes.length} devis</div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : view === 'table' ? (
        /* Table view */
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Numéro</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produits</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Montant</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => {
                const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.DRAFT;
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={quote.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {quote.quoteNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {quote.customer.firstName} {quote.customer.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{quote.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {quote.items.map((i: any) => i.product.name).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatEur(quote.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium ${statusCfg.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(quote.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {quote.status === 'DRAFT' && (
                          <button
                            onClick={() => sendMutation.mutate(quote.id)}
                            disabled={sendMutation.isPending}
                            className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                          >
                            Envoyer
                          </button>
                        )}
                        {quote.status === 'ACCEPTED' && (
                          <button
                            onClick={() => convertMutation.mutate(quote.id)}
                            disabled={convertMutation.isPending}
                            className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors font-medium"
                          >
                            → Commande
                          </button>
                        )}
                        <a
                          href={`/admin/quotes/${quote.id}`}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    Aucun devis trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Kanban pipeline view */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colQuotes = quotes.filter((q) => q.status === col.status);
            return (
              <div key={col.status} className="rounded-xl border border-border bg-muted/10 p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {colQuotes.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-card rounded-lg border border-border p-3 text-xs cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedQuote(quote.id)}
                    >
                      <p className="font-medium">
                        {quote.customer.firstName} {quote.customer.lastName}
                      </p>
                      <p className="text-muted-foreground mt-0.5 line-clamp-1">
                        {quote.items.map((i: any) => i.product.name).join(', ')}
                      </p>
                      <p className="font-semibold mt-2">{formatEur(quote.total)}</p>
                    </div>
                  ))}
                  {colQuotes.length === 0 && (
                    <p className="text-xs text-muted-foreground/50 text-center py-6">Vide</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
