import { createFileRoute } from '@tanstack/react-router';
import {
  BarChart3, ArrowUpRight, ArrowDownRight,
  Eye, MousePointerClick, Timer,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

export const Route = createFileRoute('/_app/app/analytics')({
  component: AnalyticsPage,
});

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

// ─── Données mockées ───────────────────────────────────────

const MOCK_STATS = {
  totalVisits: 12847,
  totalVisitsTrend: '+8.3%',
  totalVisitsTrendUp: true,
  pageViews: 45230,
  pageViewsTrend: '+12.1%',
  pageViewsTrendUp: true,
  bounceRate: 32.4,
  bounceRateTrend: '-2.1%',
  bounceRateTrendUp: false,
  avgDuration: '4m32s',
  avgDurationTrend: '+5.7%',
  avgDurationTrendUp: true,
};

const MOCK_VISITS_30_DAYS = [
  { day: 'J-29', visites: 320 },
  { day: 'J-28', visites: 380 },
  { day: 'J-27', visites: 350 },
  { day: 'J-26', visites: 410 },
  { day: 'J-25', visites: 390 },
  { day: 'J-24', visites: 430 },
  { day: 'J-23', visites: 380 },
  { day: 'J-22', visites: 450 },
  { day: 'J-21', visites: 420 },
  { day: 'J-20', visites: 480 },
  { day: 'J-19', visites: 510 },
  { day: 'J-18', visites: 470 },
  { day: 'J-17', visites: 490 },
  { day: 'J-16', visites: 530 },
  { day: 'J-15', visites: 500 },
  { day: 'J-14', visites: 560 },
  { day: 'J-13', visites: 540 },
  { day: 'J-12', visites: 580 },
  { day: 'J-11', visites: 550 },
  { day: 'J-10', visites: 610 },
  { day: 'J-9', visites: 590 },
  { day: 'J-8', visites: 630 },
  { day: 'J-7', visites: 600 },
  { day: 'J-6', visites: 650 },
  { day: 'J-5', visites: 620 },
  { day: 'J-4', visites: 680 },
  { day: 'J-3', visites: 660 },
  { day: 'J-2', visites: 710 },
  { day: 'J-1', visites: 690 },
  { day: 'Aujourd\'hui', visites: 420 },
];

const MOCK_TOP_PAGES = [
  { url: '/', vues: 12540, tempsMoyen: '3m12s', tauxSortie: '28.5%' },
  { url: '/pricing', vues: 8720, tempsMoyen: '4m45s', tauxSortie: '35.2%' },
  { url: '/features', vues: 6540, tempsMoyen: '5m10s', tauxSortie: '22.8%' },
  { url: '/about', vues: 4320, tempsMoyen: '2m30s', tauxSortie: '40.1%' },
  { url: '/contact', vues: 3890, tempsMoyen: '1m45s', tauxSortie: '55.3%' },
  { url: '/blog', vues: 3120, tempsMoyen: '4m20s', tauxSortie: '30.7%' },
  { url: '/faq', vues: 2450, tempsMoyen: '3m05s', tauxSortie: '25.4%' },
  { url: '/docs', vues: 1890, tempsMoyen: '6m30s', tauxSortie: '18.9%' },
];

const MOCK_DEVICES = [
  { name: 'Desktop', value: 62, color: COLORS.primary },
  { name: 'Mobile', value: 31, color: COLORS.warning },
  { name: 'Tablet', value: 7, color: COLORS.info },
];

const MOCK_SOURCES = [
  { name: 'Direct', value: 45, color: COLORS.primary },
  { name: 'Recherche', value: 28, color: COLORS.success },
  { name: 'Réseaux', value: 15, color: COLORS.purple },
  { name: 'Email', value: 8, color: COLORS.warning },
  { name: 'Autres', value: 4, color: COLORS.muted },
];

// ─── Composants ───────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, color, trend, trendLabel }: {
  label: string; value: string; icon: any; color: string;
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

// ─── Graphiques ────────────────────────────────────────────

function VisitsAreaChart() {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={MOCK_VISITS_30_DAYS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
          <XAxis dataKey="day" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} interval={4} />
          <YAxis stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '0.8125rem',
            }}
          />
          <Area type="monotone" dataKey="visites" stroke={COLORS.primary} strokeWidth={2} fill="url(#visitsGrad)" dot={false} activeDot={{ r: 4, fill: COLORS.primary }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function DevicesPieChart() {
  return (
    <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width="60%" height={220}>
        <PieChart>
          <Pie
            data={MOCK_DEVICES}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {MOCK_DEVICES.map((entry, index) => (
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
        {MOCK_DEVICES.map((d, i) => (
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

function SourcesBarChart() {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={MOCK_SOURCES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
          <XAxis type="number" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="name" type="category" stroke={COLORS.muted} fontSize={12} tickLine={false} axisLine={false} width={80} />
          <Tooltip
            contentStyle={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '0.8125rem',
            }}
            formatter={(value: number) => [`${value}%`, 'Trafic']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {MOCK_SOURCES.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────

function AnalyticsPage() {
  const s = MOCK_STATS;

  const kpiCards = [
    { label: 'Visites totales', value: s.totalVisits.toLocaleString('fr-FR'), icon: BarChart3, color: COLORS.primary, trend: 'up' as const, trendLabel: s.totalVisitsTrend },
    { label: 'Pages vues', value: s.pageViews.toLocaleString('fr-FR'), icon: Eye, color: COLORS.success, trend: 'up' as const, trendLabel: s.pageViewsTrend },
    { label: 'Taux de rebond', value: `${s.bounceRate}%`, icon: MousePointerClick, color: COLORS.warning, trend: 'down' as const, trendLabel: s.bounceRateTrend },
    { label: 'Durée moyenne', value: s.avgDuration, icon: Timer, color: COLORS.purple, trend: 'up' as const, trendLabel: s.avgDurationTrend },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.text }}>
            Analytics du site vitrine
          </h1>
          <p style={{ fontSize: '0.8125rem', color: COLORS.muted, marginTop: '0.125rem' }}>
            Opays.io — Statistiques de fréquentation
          </p>
        </div>
      </div>

      {/* KPIs — 4 cartes */}
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

      {/* Graphique visites 30 jours */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Card
          title="Visites (30 derniers jours)"
          subtitle="Évolution quotidienne du trafic sur opays.io"
        >
          <VisitsAreaChart />
        </Card>
      </div>

      {/* Row: Appareils + Sources */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <Card
          title="Appareils"
          subtitle="Répartition par type d'appareil"
        >
          <DevicesPieChart />
        </Card>

        <Card
          title="Sources de trafic"
          subtitle="Provenance des visiteurs"
        >
          <SourcesBarChart />
        </Card>
      </div>

      {/* Tableau pages les plus visitées */}
      <Card
        title="Pages les plus visitées"
        subtitle="Classement par nombre de vues"
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>URL</th>
                <th style={{ textAlign: 'right', padding: '0.625rem 0.75rem', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Vues</th>
                <th style={{ textAlign: 'right', padding: '0.625rem 0.75rem', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Temps moyen</th>
                <th style={{ textAlign: 'right', padding: '0.625rem 0.75rem', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Taux sortie</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_PAGES.map((page, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.625rem 0.75rem', fontWeight: 500, color: COLORS.primary, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {page.url}
                  </td>
                  <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', fontWeight: 600, color: COLORS.text }}>
                    {page.vues.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', color: COLORS.text }}>
                    {page.tempsMoyen}
                  </td>
                  <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', color: COLORS.text }}>
                    {page.tauxSortie}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
