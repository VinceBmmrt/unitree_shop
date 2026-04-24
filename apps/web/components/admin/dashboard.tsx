'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  FileText,
  Users,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];

export function AdminDashboard() {
  const from = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const to = format(new Date(), 'yyyy-MM-dd');

  const { data: revenue, isLoading: revLoading } = useQuery({
    queryKey: ['admin', 'revenue', from, to],
    queryFn: async () => {
      const res = await apiClient.get('/admin/analytics/revenue', { params: { from, to } });
      return res.data.data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/analytics/customers');
      return res.data.data;
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ['admin', 'stock-alerts'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/inventory/alerts', { params: { threshold: 5 } });
      return res.data.data as any[];
    },
  });

  const { data: quotesData } = useQuery({
    queryKey: ['admin', 'quotes', 'recent'],
    queryFn: async () => {
      const res = await apiClient.get('/quotes', { params: { limit: 5 } });
      return res.data.data.data as any[];
    },
  });

  const formatEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          30 derniers jours · {format(new Date(), "d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Revenu (30j)',
            value: revenue ? formatEur(revenue.totalRevenue) : '—',
            sub: `${revenue?.orderCount ?? 0} commandes`,
            icon: TrendingUp,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Panier moyen',
            value: revenue ? formatEur(revenue.avgOrderValue) : '—',
            sub: 'TVA incluse',
            icon: ShoppingBag,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
          },
          {
            label: 'Clients totaux',
            value: customers?.totalUsers?.toLocaleString() ?? '—',
            sub: `+${customers?.newUsersThisMonth ?? 0} ce mois`,
            icon: Users,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
          },
          {
            label: 'Alertes stock',
            value: alerts?.length?.toString() ?? '—',
            sub: 'produits < 5 unités',
            icon: AlertTriangle,
            color: alerts?.length ? 'text-orange-500' : 'text-muted-foreground',
            bg: alerts?.length ? 'bg-orange-500/10' : 'bg-muted/20',
          },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {kpi.label}
              </p>
              <span className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </span>
            </div>
            <p className="font-display text-2xl font-bold tabular-nums">
              {revLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : kpi.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart + Category breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium text-sm mb-5">Revenu quotidien (€ TTC)</h2>
          {revenue?.dailyRevenue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenue.dailyRevenue} margin={{ left: -20 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => format(new Date(d), 'dd/MM')}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: any) => [formatEur(v), 'Revenu']}
                  labelFormatter={(d) => format(new Date(d), 'dd MMMM', { locale: fr })}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Aucune donnée sur cette période
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium text-sm mb-5">Revenu par catégorie</h2>
          {revenue?.categoryRevenue?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={revenue.categoryRevenue}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {revenue.categoryRevenue.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {revenue.categoryRevenue.map((c: any, i: number) => (
                  <div key={c.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-muted-foreground truncate max-w-[100px]">
                        {c.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="font-medium tabular-nums">{formatEur(c.revenue)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Aucune donnée
            </div>
          )}
        </div>
      </div>

      {/* Recent quotes + Stock alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent quotes */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-sm">Devis récents</h2>
            <a href="/admin/quotes" className="text-xs text-primary hover:underline">
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {quotesData?.map((q: any) => (
              <a
                key={q.id}
                href={`/admin/quotes/${q.id}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:opacity-70 transition-opacity"
              >
                <div>
                  <p className="text-sm font-medium">
                    {q.customer.firstName} {q.customer.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{q.quoteNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatEur(q.total)}
                  </p>
                  <p className={`text-xs ${
                    q.status === 'ACCEPTED' ? 'text-green-500' :
                    q.status === 'REJECTED' ? 'text-red-500' :
                    'text-muted-foreground'
                  }`}>
                    {q.status}
                  </p>
                </div>
              </a>
            ))}
            {!quotesData?.length && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Aucun devis récent
              </p>
            )}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Alertes stock faible
            </h2>
          </div>
          <div className="space-y-3">
            {alerts?.map((alert: any) => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{alert.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.warehouse.name} · SKU {alert.product.sku}
                  </p>
                </div>
                <span className={`text-sm font-bold tabular-nums ${
                  alert.quantityOnHand === 0 ? 'text-destructive' : 'text-orange-500'
                }`}>
                  {alert.quantityOnHand} restants
                </span>
              </div>
            ))}
            {!alerts?.length && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                ✓ Stock suffisant sur tous les produits
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
