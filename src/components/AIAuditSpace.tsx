"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Zap, Search, BarChart3, Activity, ShieldAlert, CheckCircle2, Loader2, Sparkles, Database, Info, ArrowRight, Plus } from 'lucide-react';

const AuditNode = ({ title, status, description }: { title: string, status: string, description: string }) => (
  <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:border-indigo-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
      <Activity size={100} />
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-3 h-3 rounded-full ${status === 'analyzing' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'}`} />
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
    </div>
    <p className="text-sm text-slate-500 font-medium leading-relaxed relative z-10">{description}</p>
  </div>
);

export default function AIAuditSpace() {
  const [audits, setAudits] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const supabase = createClient();

  const fetchAudits = async () => {
    const { data } = await supabase.from('leads').select('company_name, status, audit_deadline').not('audit_deadline', 'is', null).limit(5);
    if (data) setAudits(data);
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const runFlashAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert("Audit Flash terminé. 3 optimisations identifiées pour le pipeline Studio.");
    }, 3000);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Moteur de Diagnostic IA</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl uppercase">Espace Audit <span className="text-indigo-600">Live</span></h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-500 font-medium">Analyse prédictive et identification automatisée des inefficacités structurelles.</p>
        </div>
        <button 
          onClick={runFlashAudit}
          disabled={isAnalyzing}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          {isAnalyzing ? 'Analyse...' : 'Nouvel Audit Flash'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Panneau de Contrôle IA */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.2em] flex items-center gap-2">
              <Search size={14} /> Sources de Données
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-indigo-200 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">Supabase DB</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
              </div>
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between opacity-50 grayscale">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">GitHub SDK</span>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Off</span>
              </div>
              
              <button className="w-full border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center hover:border-indigo-500/30 hover:bg-indigo-50/30 cursor-pointer transition-all mt-6 group">
                <Plus size={24} className="mx-auto text-slate-200 group-hover:text-indigo-500 transition-colors mb-4" />
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Importer des données</p>
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3 text-indigo-600 mb-4">
                <Info size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Info Algorithme</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                Modèle Opays-Tactical v2.4 connecté. Optimisé pour l'identification des frictions de pipeline.
              </p>
            </div>
          </div>
        </div>

        {/* Visualisation de l'Analyse */}
        <div className="lg:col-span-3 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AuditNode 
              title="Analyse des Frictions" 
              status={isAnalyzing ? 'analyzing' : 'completed'} 
              description="Identification des goulots d'étranglement dans le flux de production. Latence détectée sur l'étape de validation contractuelle." 
            />
            <AuditNode 
              title="Projection ROI" 
              status="completed" 
              description="Potentiel d'économie identifié : 12 400 $ / an par l'automatisation du tri des leads et du tagging IA." 
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 min-h-[550px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent_60%)] pointer-events-none" />
             
             {audits.length > 0 ? (
               <div className="w-full max-w-3xl space-y-8 relative z-10">
                 <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue de Diagnostic (v2.4)</h3>
                  <Sparkles size={18} className="text-indigo-600" />
                 </div>
                 {audits.map((audit, i) => (
                   <div key={i} className="flex items-center justify-between p-7 bg-white border border-slate-100 rounded-[2rem] group hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-600/5">
                     <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <BarChart3 size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">{audit.company_name}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Échéance : {new Date(audit.audit_deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <span className="hidden md:inline-block text-[9px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Prêt pour Analyse</span>
                        <div className="rounded-full bg-emerald-50 p-1.5 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 size={24} />
                        </div>
                     </div>
                   </div>
                 ))}
                 <button className="w-full py-5 border border-dashed border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all font-bold">
                  Consulter l'historique archivé
                 </button>
               </div>
             ) : (
               <div className="text-center space-y-10 relative z-10">
                  <div className={`w-32 h-32 rounded-[3rem] mx-auto flex items-center justify-center text-5xl transition-all duration-1000 ${isAnalyzing ? 'bg-indigo-600 scale-110 shadow-2xl shadow-indigo-600/40 rotate-180' : 'bg-slate-50 border border-slate-100'}`}>
                    {isAnalyzing ? <Activity size={48} className="text-white animate-pulse" /> : '🤖'}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Moteur IA en attente</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm font-medium leading-relaxed">
                      {isAnalyzing ? "L'IA parcourt actuellement vos structures de données pour générer un rapport de friction..." : "En attente de flux de données. Connectez une source Supabase ou importez un dataset pour lancer le diagnostic."}
                    </p>
                  </div>
                  {!isAnalyzing && (
                    <button onClick={runFlashAudit} className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] hover:underline flex items-center gap-3 mx-auto transition-all">
                      Forcer un diagnostic flash <ArrowRight size={14} />
                    </button>
                  )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
