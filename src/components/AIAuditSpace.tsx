"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Zap, Search, BarChart3, Activity, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

const AuditNode = ({ title, status, description }: { title: string, status: string, description: string }) => (
  <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl shadow-xl hover:border-blue-500/30 transition-all group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-2 h-2 rounded-full ${status === 'analyzing' ? 'bg-blue-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`} />
      <h4 className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">{title}</h4>
    </div>
    <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
  </div>
);

export default function AIAuditSpace() {
  const [audits, setAudits] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const supabase = createClient();

  const fetchAudits = async () => {
    // Note: This assumes an 'audits' table exists or uses a simulated fallback
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
    <div className="p-8 space-y-10 bg-black min-h-screen text-zinc-300 selection:bg-blue-500/30">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500 uppercase">Intelligence Opérationnelle</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Espace Audit <span className="text-blue-500">Live</span></h1>
        </div>
        <button 
          onClick={runFlashAudit}
          disabled={isAnalyzing}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {isAnalyzing ? 'Analyse...' : 'Nouvel Audit Flash'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Panneau de Contrôle IA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-widest flex items-center gap-2">
              <Search size={12} /> Sources Actives
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex items-center justify-between group cursor-pointer hover:bg-zinc-800 transition-all">
                <span className="text-xs font-semibold">Base Supabase</span>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex items-center justify-between opacity-50">
                <span className="text-xs font-semibold">GitHub Repo</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Connecter</span>
              </div>
              <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all mt-6">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Import Custom Data</p>
              </div>
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

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
             
             {audits.length > 0 ? (
               <div className="w-full max-w-2xl space-y-4">
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center mb-6">File d'attente d'audit (IA Engine v2.4)</h3>
                 {audits.map((audit, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                          <BarChart3 size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{audit.company_name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Échéance Audit : {new Date(audit.audit_deadline).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded uppercase tracking-widest">Ready for Deep Dive</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center space-y-4 relative z-10">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl transition-all duration-1000 ${isAnalyzing ? 'bg-blue-600 scale-110 shadow-[0_0_40px_rgba(37,99,235,0.4)] rotate-180' : 'bg-zinc-800 shadow-2xl'}`}>
                    {isAnalyzing ? <Activity size={32} className="text-white animate-pulse" /> : '🤖'}
                  </div>
                  <p className="text-zinc-500 max-w-md mx-auto text-sm">
                    {isAnalyzing ? "L'IA parcourt actuellement vos structures de données pour générer un rapport de friction..." : "En attente de données... Connectez une source pour lancer l'analyse prédictive d'efficience."}
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
