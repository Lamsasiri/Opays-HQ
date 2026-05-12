"use client";

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Box, 
  Play, 
  RefreshCcw, 
  ShieldCheck, 
  Clock, 
  Layout, 
  ChevronRight,
  Database,
  Globe,
  Lock,
  Zap,
  Info
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function WorkspacePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      const { data: proj } = await supabase.from('projects').select('id, title, status, tech_stack').limit(3);
      if (proj) setProjects(proj);

      const { data: taskLogs } = await supabase.from('tasks').select('title, status, updated_at, projects(title)').order('updated_at', { ascending: false }).limit(5);
      
      const realLogs = [
        "[SYSTEM] Initialisation de l'environnement Studio...",
        "[AUTH] Connexion Supabase établie.",
        ...(taskLogs || []).map(t => {
          const proj = Array.isArray(t.projects) ? t.projects[0] : t.projects;
          return `[TASK] ${proj?.title || 'System'} : ${t.title} (${t.status})`;
        }),
        "[WORKSPACE] Prêt pour la livraison."
      ];
      setLogs(realLogs);
    };
    fetchWorkspaceData();
  }, []);

  const runBuild = () => {
    setIsBuilding(true);
    const newLog = `[BUILD] Lancement de la compilation v2.4.1 à ${new Date().toLocaleTimeString()}...`;
    setLogs(prev => [...prev, newLog]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "[BUILD] Optimisation des assets terminée.", "[BUILD] Déploiement vers Vercel Edge..."]);
    }, 2000);

    setTimeout(() => {
      setIsBuilding(false);
      setLogs(prev => [...prev, "[SUCCESS] Build déployé avec succès sur production."]);
    }, 5000);
  };

  return (
    <div className="p-8 space-y-10 min-h-screen bg-gray-50/50">
      {/* 🧭 Purpose Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Terminal size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Info size={12} /> Centre d'Exécution Technique
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Espace de Travail Ingénierie</h1>
          <p className="text-blue-100/80 leading-relaxed">
            Bienvenue dans la <strong>salle de contrôle technique</strong> d'OPAYS. C'est ici que vous pilotez le déploiement des solutions, surveillez la santé des serveurs et gérez la pile technologique de chaque projet client.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📟 Live Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={12} /> Console de Production
                </span>
              </div>
              <button 
                onClick={runBuild}
                disabled={isBuilding}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isBuilding ? <RefreshCcw size={12} className="animate-spin" /> : <Play size={12} />}
                {isBuilding ? 'Build en cours...' : 'Lancer un Build'}
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${log.includes('[SUCCESS]') ? 'text-green-400' : log.includes('[BUILD]') ? 'text-blue-400' : 'text-zinc-400'}`}>
                  <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {isBuilding && <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block align-middle ml-2" />}
            </div>
          </div>
        </div>

        {/* 🛠️ Infrastructure Overview */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu size={14} /> État de l'Infrastructure
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Endpoints API</p>
                    <p className="text-[10px] text-gray-500">Global Region</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database size={18} className="text-purple-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Database Engine</p>
                    <p className="text-[10px] text-gray-500">Supabase Cloud</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase">Optimal</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-orange-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Securité RLS</p>
                    <p className="text-[10px] text-gray-500">Vérification auto</p>
                  </div>
                </div>
                <ShieldCheck size={16} className="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Box size={14} /> Monitoring Projets
            </h3>
            <div className="space-y-3">
              {projects.map(p => (
                <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="block p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all group">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.title}</p>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.tech_stack?.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[8px] font-bold px-1.5 py-0.5 bg-white border border-gray-200 rounded-md text-gray-400 uppercase tracking-tighter">{t}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
