"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Search, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Activity,
  Bot,
  BrainCircuit,
  Workflow,
  Command,
  Layout,
  Globe
} from 'lucide-react';
import AICreativeAgent from '@/components/AICreativeAgent';
import AIAuditSpace from '@/components/AIAuditSpace';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'STUDIO' | 'AUDIT'>('STUDIO');

  const tabs = [
    { id: 'STUDIO', label: 'AI Studio', icon: <Sparkles size={18} />, description: 'Génération créative & Agents' },
    { id: 'AUDIT', label: 'Espace Audit', icon: <Activity size={18} />, description: 'Analyse & Optimisation' },
  ];

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
      
      <div className="relative z-10 mx-auto max-w-[1600px] space-y-10">
        <header className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">
              <BrainCircuit size={14} /> Cognitive Intelligence
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">AI Command Center</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 font-medium">L'interface centrale pour piloter les agents autonomes, les automatisations et les analyses prédictives d'Opays Tech.</p>
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-2 md:w-fit rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-1 md:flex-none items-center gap-3 rounded-2xl px-6 py-3.5 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest leading-none">{tab.label}</p>
                  <p className={`mt-1 text-[9px] font-medium uppercase tracking-wider opacity-60 ${activeTab === tab.id ? 'text-blue-300' : 'text-slate-400'}`}>
                    {tab.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'STUDIO' && (
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Studio Area */}
            <div className="xl:col-span-8 space-y-10">
              <AICreativeAgent />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-600/5">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Workflow size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Automatisations Flux</h3>
                  <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">Connectez les données du CRM aux agents de rédaction pour automatiser la prospection.</p>
                  <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-600 hover:text-blue-700">
                    Ouvrir le Workflow <ArrowRight size={14} />
                  </button>
                </div>

                <div className="group rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm hover:border-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-600/5">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <Bot size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Agents Personnalisés</h3>
                  <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">Configurez des assistants spécialisés pour l'audit, le juridique ou le support technique.</p>
                  <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-violet-600 hover:text-violet-700">
                    Gérer les Agents <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Stats & Info */}
            <div className="xl:col-span-4 space-y-8">
              <div className="rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl shadow-slate-900/20">
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
                    <Cpu size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Status Infra</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Modèles Actifs</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { name: 'GPT-4o (Reasoning)', status: 'Optimal', latency: '120ms', color: 'bg-emerald-400' },
                    { name: 'Claude 3.5 Sonnet', status: 'Optimal', latency: '85ms', color: 'bg-emerald-400' },
                    { name: 'Opays Custom RAG', status: 'Ready', latency: '210ms', color: 'bg-blue-400' },
                  ].map((model) => (
                    <div key={model.name} className="flex items-center justify-between border-b border-white/10 pb-6 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-tight">{model.name}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Latency: {model.latency}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{model.status}</span>
                        <div className={`h-2 w-2 rounded-full ${model.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck size={18} className="text-blue-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sécurité Souveraine</p>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400 font-medium italic">
                    Toutes les interactions sont chiffrées. Les données clients ne sont pas utilisées pour l'entraînement des modèles publics.
                  </p>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Globe size={120} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.28em] text-slate-900 mb-8">Utilisation Mensuelle</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Tokens Consommés</span>
                      <span className="text-slate-900">1.2M / 5.0M</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Analyses Audit</span>
                      <span className="text-slate-900">42 / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
                <p className="mt-10 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 leading-relaxed italic">
                  Quota réinitialisé dans <span className="text-slate-900">12 jours</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AUDIT' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIAuditSpace />
          </div>
        )}
      </div>
    </div>
  );
}
