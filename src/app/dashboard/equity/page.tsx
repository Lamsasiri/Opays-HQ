import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';

export default async function EquityPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const isAuthorized = profile?.type === 'ASSOCIATE' || profile?.permissions?.equity || ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '');

  if (!isAuthorized) {
    redirect('/dashboard');
  }

  const { data: logs } = await supabase
    .from('equity_vesting_logs')
    .select('*')
    .eq('profile_id', user?.id)
    .order('month', { ascending: false });

  const totalVested = logs?.reduce((acc, log) => acc + log.shares_unlocked, 0) || 0;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mes Actions</h1>
        <p className="text-gray-500 mt-1 text-sm">Suivez en temps réel vos parts dans le capital d'OPAYS TECH.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Parts Débloquées</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-gray-900">{totalVested.toFixed(2)}%</h3>
            <span className="text-gray-400 text-sm">sur {profile?.equity_percent || 0}%</span>
          </div>
          <div className="mt-6 w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(totalVested / (profile?.equity_percent || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Award size={20} />
            <span className="text-sm font-medium">Objectif Cible</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{profile?.equity_percent || 0}%</h3>
          <p className="text-xs text-blue-600 font-semibold mt-2">Vesting sur 2 ans (Cliff 6 mois)</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Calendar size={20} />
            <span className="text-sm font-medium">Prochain Déblocage</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1er du mois</h3>
          <p className="text-xs text-gray-400 mt-2">Sous réserve de l'apport de service validé.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Historique des Dotations</h2>
        <div className="space-y-3">
          {logs?.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dotation Mensuelle - {new Date(log.month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-400">{log.contribution_notes}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">+{log.shares_unlocked}%</span>
            </div>
          ))}

          {!logs?.length && (
            <div className="py-10 text-center">
              <p className="text-gray-400 italic">Aucune dotation enregistrée pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
