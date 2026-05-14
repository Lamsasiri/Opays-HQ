import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { canAccessPath } from '@/lib/rbac';

export default async function EquityPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (!canAccessPath(profile, '/dashboard/equity')) {
    redirect('/dashboard');
  }

  const { data: logs } = await supabase
    .from('equity_vesting_logs')
    .select('*')
    .eq('profile_id', user?.id)
    .order('month', { ascending: false });

  const totalVested = logs?.reduce((acc, log) => acc + log.shares_unlocked, 0) || 0;

  return (
    <div className="relative min-h-full text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 space-y-8 p-6 md:p-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">
            <Award size={12} /> Equity Center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Mes Actions</h1>
          <p className="max-w-2xl text-sm text-slate-500 font-medium">Suivez en temps réel vos parts dans le capital d'OPAYS TECH, avec une lecture claire du vesting et des prochains débloquages.</p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3 text-slate-400">
              <TrendingUp size={20} className="text-cyan-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Parts Débloquées</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{totalVested.toFixed(2)}%</h3>
              <span className="text-sm font-medium text-slate-400">sur {profile?.equity_percent || 0}%</span>
            </div>
            <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000" 
                style={{ width: `${(totalVested / (profile?.equity_percent || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3 text-slate-400">
              <Award size={20} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Objectif Cible</span>
            </div>
            <h3 className="text-4xl font-bold text-slate-900">{profile?.equity_percent || 0}%</h3>
            <p className="mt-2 text-xs font-bold text-cyan-600 uppercase tracking-wide">Vesting sur 2 ans (Cliff 6 mois)</p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3 text-slate-400">
              <Calendar size={20} className="text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Prochain Déblocage</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">1er du mois</h3>
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Sous réserve d'apport de service validé</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-bold text-slate-900 uppercase tracking-tight">Historique des Dotations</h2>
          <div className="space-y-3">
            {logs?.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-white hover:border-emerald-200 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 capitalize">Dotation Mensuelle - {new Date(log.month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                    <p className="text-xs text-slate-500 font-medium">{log.contribution_notes}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600">+{log.shares_unlocked}%</span>
              </div>
            ))}

            {!logs?.length && (
              <div className="py-10 text-center">
                <p className="italic text-slate-400">Aucune dotation enregistrée pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
