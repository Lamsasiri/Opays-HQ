import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Wallet, Handshake, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default async function TreasuryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (!['CEO', 'COO', 'ADMIN'].includes(profile?.role || '')) {
    redirect('/dashboard');
  }

  const { data: logs } = await supabase
    .from('treasury_logs')
    .select('*')
    .order('date', { ascending: false });

  const { data: partnerships } = await supabase
    .from('partnerships')
    .select('*');

  const balance = logs?.reduce((acc, log) => acc + (log.type === 'INCOME' ? log.amount : -log.amount), 0) || 0;
  const income = logs?.filter(l => l.type === 'INCOME').reduce((acc, l) => acc + l.amount, 0) || 0;
  const expenses = logs?.filter(l => l.type === 'EXPENSE').reduce((acc, l) => acc + l.amount, 0) || 0;

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Caisse & Partenaires</h1>
          <p className="text-gray-500 mt-1 text-sm">Suivi de l'argent et des alliances d'OPAYS TECH.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Handshake size={18} /> Nouveau Partenaire
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={18} /> Nouvelle Transaction
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Wallet size={80} />
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Solde Actuel</p>
          <h3 className="text-4xl font-bold text-gray-900">{balance.toLocaleString()} $</h3>
          <div className="mt-6 flex gap-6">
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <ArrowUpRight size={16} /> {income.toLocaleString()} $
            </div>
            <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
              <ArrowDownRight size={16} /> {expenses.toLocaleString()} $
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Partenariats Actifs</h3>
            <div className="space-y-3">
              {partnerships?.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{p.status}</span>
                </div>
              ))}
              {!partnerships?.length && <p className="text-xs text-gray-400 italic">Aucun partenaire enregistré.</p>}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Derniers Flux</h3>
            <div className="space-y-3">
              {logs?.slice(0, 5).map(log => (
                <div key={log.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{log.description}</span>
                  <span className={`font-semibold ${log.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                    {log.type === 'INCOME' ? '+' : '-'}{log.amount} $
                  </span>
                </div>
              ))}
              {!logs?.length && <p className="text-xs text-gray-400 italic">Aucun mouvement récent.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
