import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '@/hooks/useUser';
import { can } from '@/lib/rbac';
import { useState, useEffect, useMemo } from 'react';
import { apiGetDashboardStats, apiGetTasks, apiGetProjects, apiGetTreasury } from '@/lib/api';
import {
  ListTodo, FolderKanban, TrendingUp, Users,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
  DollarSign, Search, Plus,
  FileText, ChevronRight, Bell
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

export const Route = createFileRoute('/_app/app/dashboard')({
  component: DashboardPage,
});

// ─── Helpers ──────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0, style: 'currency', currency: 'USD' }).replace('USD', '$').trim();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

// ─── Couleurs ──────────────────────────────────────────────

const COLORS = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
  info: '#0891b2',
  purple: '#7c3aed',
  pink: '#db2777',
  gray: '#64748b',
  bg: '#f1f5f9',
  card: '#ffffff',
  sidebar: '#0f172a',
  text: '#1e293b',
  muted: '#94a3b8',
  border: '#e2e8f0',
};

const CHART_COLORS = ['#2563eb', '#f59e0b', '#16a34a', '#dc2626', '#7c3aed', '#0891b2'];

// ─── Composants ───────────────────────────────────────────

function KpiCard({ label, value, subtitle, icon: Icon, color, trend, trendLabel }: {
  label: string; value: string; subtitle?: string; icon: any; color: string;
  trend?: 'up' | 'down'; trendLabel?: string;
}) {
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: '12px',
      padding: '1.25rem',
      border: `1px solid ${COLORS.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: COLORS.muted, marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
        {trend && trendLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {trend === 'up' ? (
              <ArrowUpRight size={12} style={{ color: COLORS.success }} />
            ) : (
              <ArrowDownRight size={12} style={{ color: COLORS.danger }} />
            )}
            <span style={{ color: trend === 'up' ? COLORS.success : COLORS.danger, fontWeight: 600 }}>{trendLabel}</span>
          </div>
        )}
      </div>
      <div style={{
        width: '2.5rem', height: '2.5rem', borderRadius: '10px',
        background: `${color}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, action }: {
  title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: '12px',
      border: `1px solid ${COLORS.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: COLORS.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: '0.75rem', color: COLORS.muted, marginTop: '0.125rem' }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.6875rem',
      fontWeight: 600,
      background: `${color}15`,
      color: color,
    }}>
      {label}
    </span>
  );
}

// ─── Graphiques ────────────────────────────────────────────

function RevenueChart({ logs }: { logs: any[] }) {
  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
      let balance = 0;
      return months.map(m => {
        balance += Math.random() * 8000 - 2000;
        return { month: m, revenus: Math.round(balance * 100) / 100 };
      });
    }
    const grouped: Record<string, { revenus: number; depenses: number }> = {};
    for (const log of logs) {
      const month = new Date(log.created_at).toLocaleDateString('fr-FR', { month: 'short' });
      if (!grouped[month]) grouped[month] = { revenus: 0, depenses: 0 };
      if (log.type === 'income') grouped[month].revenus += log.amount;
      else grouped[month].depenses += log.amount;
    }
    return Object.entries(grouped).map(([month, d]) => ({ month, ...d }));
  }, [logs]);

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.1} />
              <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
          <XAxis dataKey="month" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '0.8125rem',
            }}
          />
          <Area type="monotone" dataKey="revenus" stroke={COLORS.primary} strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: COLORS.primary }} />
          <Area type="monotone" dataKey="depenses" stroke={COLORS.danger} strokeWidth={2} fill="url(#depGrad)" dot={false} activeDot={{ r: 4, fill: COLORS.danger }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function InvoicesPieChart() {
  const data = [
    { name: 'Payées', value: 45, color: COLORS.success },
    { name: 'En attente', value: 30, color: COLORS.warning },
    { name: 'Impayées', value: 15, color: COLORS.danger },
    { name: 'Brouillons', value: 10, color: COLORS.muted },
  ];

  return (
    <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width="60%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '0.8125rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
            <span style={{ color: COLORS.muted }}>{d.name}</span>
            <span style={{ fontWeight: 600, color: COLORS.text }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodoList({ tasks }: { tasks: any[] }) {
  const urgent = tasks.filter((t: any) => t.priority === 'urgent' || t.priority === 'high').slice(0, 5);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div>
      {urgent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: COLORS.muted, fontSize: '0.8125rem' }}>
          Aucune tâche urgente — tout est sous contrôle ✓
        </div>
      ) : urgent.map((t: any) => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0',
          borderBottom: `1px solid ${COLORS.border}`,
          opacity: checked[t.id] ? 0.5 : 1,
          textDecoration: checked[t.id] ? 'line-through' : 'none',
        }}>
          <div
            onClick={() => setChecked(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
            style={{
              width: 18, height: 18, borderRadius: '4px', flexShrink: 0, cursor: 'pointer',
              border: `2px solid ${checked[t.id] ? COLORS.success : COLORS.border}`,
              background: checked[t.id] ? COLORS.success : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {checked[t.id] && <span style={{ color: 'white', fontSize: '0.625rem', fontWeight: 700 }}>✓</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t.title}
            </div>
            <div style={{ fontSize: '0.6875rem', color: COLORS.muted, marginTop: '0.125rem' }}>
              {t.project_name || 'Sans projet'} · {timeAgo(t.created_at)}
            </div>
          </div>
          <Badge label={t.priority || 'medium'} color={t.priority === 'urgent' ? COLORS.danger : t.priority === 'high' ? COLORS.warning : COLORS.muted} />
        </div>
      ))}
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { icon: FileText, text: 'Facture FACT-2026-0001 créée', time: 'il y a 2h', color: COLORS.primary },
    { icon: CheckCircle2, text: 'Tâche « Audit CRM » terminée', time: 'il y a 4h', color: COLORS.success },
    { icon: TrendingUp, text: 'Nouveau lead : ACME SARL', time: 'il y a 6h', color: COLORS.warning },
    { icon: Users, text: 'Patricia Zamwana a rejoint l\'équipe', time: 'il y a 1j', color: COLORS.purple },
    { icon: DollarSign, text: 'Paiement reçu — 2 500 $', time: 'il y a 1j', color: COLORS.success },
  ];

  return (
    <div>
      {activities.map((a, i) => {
        const Icon = a.icon;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.625rem 0',
            borderBottom: i < activities.length - 1 ? `1px solid ${COLORS.border}` : 'none',
          }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '8px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${a.color}12`,
            }}>
              <Icon size={14} style={{ color: a.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', color: COLORS.text }}>{a.text}</div>
              <div style={{ fontSize: '0.6875rem', color: COLORS.muted, marginTop: '0.125rem' }}>{a.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────

function DashboardPage() {
  const { user } = useUser();
  const roleName = user?.role_name || null;
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [treasury, setTreasury] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetDashboardStats(),
      apiGetTasks(),
      apiGetProjects(),
      apiGetTreasury(),
    ]).then(([s, t, p, tr]) => {
      if (s.data?.stats) setStats(s.data.stats);
      if (t.data?.tasks) setTasks(t.data.tasks);
      if (p.data?.projects) setProjects(p.data.projects);
      if (tr.data?.logs) setTreasury(tr.data.logs);
      setLoading(false);
    });
  }, []);

  const kpiCards = [
    { label: 'Chiffre d\'affaires', value: stats ? `${fmtCurrency((stats.totalIncome || 0))}` : '—', subtitle: 'Ce mois', icon: DollarSign, color: COLORS.primary, trend: 'up' as const, trendLabel: '+12% vs mois préc.' },
    { label: 'Dépenses', value: stats ? `${fmtCurrency((stats.totalExpense || 0))}` : '—', subtitle: 'Ce mois', icon: TrendingUp, color: COLORS.danger, trend: 'down' as const, trendLabel: '-5% vs mois préc.' },
    { label: 'Projets actifs', value: stats?.activeProjects ?? '—', subtitle: `${stats?.activeProjects || 0} en cours`, icon: FolderKanban, color: COLORS.success },
    { label: 'Tâches en cours', value: stats?.tasksInProgress ?? '—', subtitle: `${stats?.urgentTasks || 0} urgentes`, icon: ListTodo, color: COLORS.warning },
    { label: 'Employés', value: stats?.totalUsers ?? '—', subtitle: 'Équipe active', icon: Users, color: COLORS.purple },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header type ProfiMax */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.text }}>
            Tableau de bord
          </h1>
          <p style={{ fontSize: '0.8125rem', color: COLORS.muted, marginTop: '0.125rem' }}>
            {user?.role_label || '—'} · {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: '8px', padding: '0.375rem 0.75rem',
          }}>
            <Search size={14} style={{ color: COLORS.muted }} />
            <input
              placeholder="Rechercher..."
              style={{ border: 'none', outline: 'none', fontSize: '0.8125rem', color: COLORS.text, background: 'transparent', width: '140px' }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: COLORS.primary, color: 'white', border: 'none',
            borderRadius: '8px', padding: '0.5rem 1rem',
            fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={14} />
            Nouveau
          </button>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            width: '2.25rem', height: '2.25rem', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: COLORS.muted, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.border}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Bell size={18} />
          </button>
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '8px',
            background: COLORS.primary, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
          }}>
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>

      {/* KPIs — 5 colonnes style ProfiMax */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Row 1: Graphique + To-Do (style ProfiMax) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <Card
          title="Revenus vs Dépenses"
          subtitle="Évolution sur les 6 derniers mois"
          action={
            <select style={{
              border: `1px solid ${COLORS.border}`, borderRadius: '6px',
              padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: COLORS.text,
              background: COLORS.card, outline: 'none', cursor: 'pointer',
            }}>
              <option>6 mois</option>
              <option>12 mois</option>
              <option>Cette année</option>
            </select>
          }
        >
          <RevenueChart logs={treasury} />
        </Card>

        <Card
          title="Tâches urgentes"
          subtitle="Prioritaires — à traiter aujourd'hui"
          action={
            <a href="/app/tasks" style={{ fontSize: '0.75rem', color: COLORS.primary, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tout <ChevronRight size={12} />
            </a>
          }
        >
          <TodoList tasks={tasks} />
        </Card>
      </div>

      {/* Row 2: Factures + Activité récente */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
      }}>
        <Card
          title="Factures par statut"
          subtitle="Répartition des factures"
        >
          <InvoicesPieChart />
        </Card>

        <Card
          title="Activité récente"
          subtitle="Les dernières actions"
          action={
            <a href="/app/activity" style={{ fontSize: '0.75rem', color: COLORS.primary, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tout <ChevronRight size={12} />
            </a>
          }
        >
          <RecentActivity />
        </Card>
      </div>
    </div>
  );
}
