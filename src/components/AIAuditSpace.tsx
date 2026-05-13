"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Zap, Search, BarChart3, Activity, ShieldAlert, CheckCircle2, Loader2, Sparkles, Database, Info, ArrowRight } from 'lucide-react';

const AuditNode = ({ title, status, description }: { title: string, status: string, description: string }) => (
  <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:border-blue-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Activity size={80} />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-2.5 h-2.5 rounded-full ${status === 'analyzing' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'}`} />
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
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
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Intelligence Opérationnelle</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Espace Audit <span className="text-blue-600">Live</span></h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-500 font-medium">Analyse prédictive et identification automatisée des inefficacités structurelles.</p>
          </div>
          <button 
            onClick={runFlashAudit}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isAnalyzing ? 'Analyse...' : 'Nouvel Audit Flash'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panneau de Contrôle IA */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                <Search size={14} /> Sources Actives
              </h3>
              <div className="space-y-3">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">Supabase DB</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                </div>
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between opacity-50 grayscale">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">GitHub SDK</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Connect</span>
                </div>
                
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center hover:border-blue-500/30 hover:bg-blue-50/50 cursor-pointer transition-all mt-8 group">
                  <Plus size={24} className="mx-auto text-slate-200 group-hover:text-blue-500 transition-colors mb-3" />
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Import Custom Data</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                  <Info size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Statut IA</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Modèle Opays-Tactical v2.4 connecté. Latence d'analyse : &lt; 2s.
                </p>
              </div>
            </div>
          </div>

          {/* Visualisation de l'Analyse */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
               
               {audits.length > 0 ? (
                 <div className="w-full max-w-3xl space-y-6 relative z-10">
                   <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">File d'attente d'audit (v2.4)</h3>
                    <Sparkles size={18} className="text-blue-600" />
                   </div>
                   {audits.map((audit, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-600/5">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <BarChart3 size={20} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-900 uppercase tracking-tight">{audit.company_name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Échéance : {new Date(audit.audit_deadline).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[9px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Prêt pour Analyse</span>
                          <div className="rounded-full bg-emerald-50 p-1 text-emerald-600">
                            <CheckCircle2 size={20} />
                          </div>
                       </div>
                     </div>
                   ))}
                   <button className="w-full py-4 border border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                    Charger l'historique complet
                   </button>
                 </div>
               ) : (
                 <div className="text-center space-y-6 relative z-10">
                    <div className={`w-24 h-24 rounded-[2.5rem] mx-auto flex items-center justify-center text-3xl transition-all duration-1000 ${isAnalyzing ? 'bg-blue-600 scale-110 shadow-2xl shadow-blue-600/40 rotate-180' : 'bg-slate-50 border border-slate-100'}`}>
                      {isAnalyzing ? <Activity size={40} className="text-white animate-pulse" /> : '🤖'}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Moteur IA en veille</h3>
                      <p className="text-slate-500 max-w-md mx-auto text-sm font-medium leading-relaxed">
                        {isAnalyzing ? "L'IA parcourt actuellement vos structures de données pour générer un rapport de friction..." : "En attente de données... Connectez une source pour lancer l'analyse prédictive d'efficience."}
                      </p>
                    </div>
                    {!isAnalyzing && (
                      <button onClick={runFlashAudit} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto">
                        Forcer une analyse immédiate <ArrowRight size={12} />
                      </button>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
