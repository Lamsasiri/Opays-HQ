"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Wallet, Handshake, Plus, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import NewTransactionModal from '@/components/modals/NewTransactionModal';
import NewPartnerModal from '@/components/modals/NewPartnerModal';

export default function TreasuryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(profileData);

    const isAuthorized = ['CEO', 'COO', 'ADMIN'].includes(profileData?.role || '') || 
                         profileData?.permissions?.treasury || 
                         profileData?.type === 'ASSOCIATE';
                         
    if (!isAuthorized) {
      window.location.href = '/dashboard';
      return;
    }

    const { data: logsData } = await supabase
      .from('treasury_logs')
      .select('*')
      .order('date', { ascending: false });
    if (logsData) setLogs(logsData);

    const { data: partnersData } = await supabase
      .from('partnerships')
      .select('*')
      .order('name', { ascending: true });
    if (partnersData) setPartnerships(partnersData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteLog = async (id: string) => {
    if (confirm("Supprimer cette transaction ?")) {
      const { error } = await supabase.from('treasury_logs').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const canEdit = ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '') || profile?.permissions?.treasury || profile?.permissions?.accounting;
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
          {canEdit && (
            <>
              <button 
                onClick={() => setIsPartnerOpen(true)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
              >
                <Handshake size={18} /> Nouveau Partenaire
              </button>
              <button 
                onClick={() => setIsTxOpen(true)}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus size={18} /> Nouvelle Transaction
              </button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden group shadow-sm">
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Partenariats Actifs ({partnerships.length})</h3>
            <div className="space-y-3">
              {partnerships?.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                  <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${p.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
              {!partnerships?.length && <p className="text-xs text-gray-400 italic">Aucun partenaire enregistré.</p>}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Flux Récents</h3>
            <div className="space-y-3">
              {logs?.slice(0, 8).map(log => (
                <div key={log.id} className="flex justify-between items-center text-sm group">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 truncate max-w-[120px]">{log.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${log.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {log.type === 'INCOME' ? '+' : '-'}{log.amount.toLocaleString()} $
                    </span>
                    {canEdit && (
                      <button onClick={() => deleteLog(log.id)} className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!logs?.length && <p className="text-xs text-gray-400 italic">Aucun mouvement récent.</p>}
            </div>
          </div>
        </div>
      </div>

      <NewTransactionModal isOpen={isTxOpen} onClose={() => setIsTxOpen(false)} onSuccess={fetchData} />
      <NewPartnerModal isOpen={isPartnerOpen} onClose={() => setIsPartnerOpen(false)} onSuccess={fetchData} />
    </div>
  );
}
