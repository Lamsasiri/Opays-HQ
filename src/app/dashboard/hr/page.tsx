"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { UserCircle, FileText, Target, BarChart3, Download, Award, Users, Sparkles, TrendingUp, DollarSign, Clock, LayoutGrid, List } from 'lucide-react';
import AdminHRView from '@/components/AdminHRView';

export default function HRPage() {
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [view, setView] = useState<'SELF' | 'ADMIN'>('SELF');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      const { data: recordData } = await supabase
        .from('hr_records')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      setRecords(recordData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
    </div>
  );

  const isAdmin = ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '') || profile?.permissions?.hr;

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
              <Sparkles size={12} /> HR & Talent Management
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">
              {view === 'SELF' ? 'Mon Espace RH' : 'Gestion du Personnel'}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-500 font-medium">
              {view === 'SELF' 
                ? 'Gérez vos documents administratifs, consultez vos performances et accédez à vos fiches de paie.' 
                : 'Supervisez l\'équipe, analysez la masse salariale et suivez les performances globales.'}
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex w-fit items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button 
                onClick={() => setView('SELF')}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  view === 'SELF' 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UserCircle size={16} /> Ma Fiche
              </button>
              <button 
                onClick={() => setView('ADMIN')}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  view === 'ADMIN' 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users size={16} /> Vue Admin
              </button>
            </div>
          )}
        </header>

        {view === 'ADMIN' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminHRView />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target size={100} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Score de Performance</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <h3 className="text-4xl font-bold text-slate-900">{records?.[0]?.performance_score || 0}%</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Global</span>
                </div>
                <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000" 
                    style={{ width: `${records?.[0]?.performance_score || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <DollarSign size={100} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Salaire de Référence</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-slate-900">{(profile?.salary_amount || 0).toLocaleString()} $</h3>
                </div>
                <p className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Clock size={14} className="text-indigo-600" /> Versé le 1er du mois
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Award size={100} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Statut & Ancienneté</p>
                <h3 className="mt-4 text-2xl font-bold uppercase tracking-tight text-slate-900">{profile?.role || 'Membre'}</h3>
                <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Depuis le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '?'}
                </p>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm">
              <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Documents & Fiches de paie</h2>
                  <p className="text-sm text-slate-500 font-medium">Historique complet de vos pièces administratives.</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-indigo-600 border border-slate-100">
                  <FileText size={24} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {records?.filter(r => r.document_url).map((record) => (
                  <div key={record.id} className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <FileText size={22} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 uppercase tracking-tight">Fiche de paie - {new Date(record.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{record.review_notes || 'Document certifié'}</p>
                      </div>
                    </div>
                    <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-400 transition hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm">
                      <Download size={20} />
                    </button>
                  </div>
                ))}

                {!records?.filter(r => r.document_url).length && (
                  <div className="rounded-[2rem] border border-dashed border-slate-200 py-24 text-center">
                    <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-sm font-medium italic text-slate-400">Aucun document administratif disponible pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
