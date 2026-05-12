"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Lightbulb, ThumbsUp, MessageSquare, Sparkles, ArrowRight, Users } from 'lucide-react';
import NewIdeaModal from '@/components/modals/NewIdeaModal';

const CategoryColors: any = {
  'TECH': 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  'SALES': 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  'OPS': 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  'OTHER': 'text-slate-300 bg-white/5 border-white/10',
};

export default function IdeasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchIdeas = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ideas')
      .select('*, profiles(full_name)')
      .order('votes', { ascending: false });
    if (data) setIdeas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.08),_transparent_26%),linear-gradient(180deg,#050816_0%,#090d1d_60%,#0b1020_100%)]" />
      <div className="relative z-10 space-y-8 p-6 md:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200 backdrop-blur">
              <Sparkles size={12} /> Espace d'amélioration
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">Idées & retours terrain</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Ici, chacun peut proposer une amélioration utile, une piste commerciale, ou une idée qui aide l'équipe à mieux travailler.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 backdrop-blur-xl transition hover:bg-white/15"
          >
            <Lightbulb size={18} /> Proposer une idée
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Objectif</p>
            <h3 className="text-lg font-semibold text-white">Améliorer le travail réel</h3>
            <p className="mt-2 text-sm text-slate-400">On privilégie les idées qui simplifient, accélèrent ou clarifient.</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Ce qu'on veut</p>
            <h3 className="text-lg font-semibold text-white">Du concret</h3>
            <p className="mt-2 text-sm text-slate-400">Une idée utile vaut mieux qu'une grande promesse abstraite.</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Esprit</p>
            <h3 className="text-lg font-semibold text-white">Construire ensemble</h3>
            <p className="mt-2 text-sm text-slate-400">Les idées servent à faire progresser l'équipe, pas à faire du bruit.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-white/20">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] ${CategoryColors[idea.category]}`}>
                  {idea.category}
                </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">{idea.status}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-white">{idea.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">{idea.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-[9px] font-bold text-cyan-300">
                    {idea.profiles?.full_name?.charAt(0)}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{idea.profiles?.full_name?.split(' ')[0] || 'Inconnu'}</span>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-cyan-300">
                    <ThumbsUp size={14} />
                    <span className="text-xs font-bold">{idea.votes}</span>
                  </button>
                  <button className="text-slate-400 transition-colors hover:text-cyan-300">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && !ideas.length && (
            <div className="col-span-full rounded-[2rem] border border-dashed border-white/10 py-20 text-center text-slate-400 italic">
            Aucune idée proposée pour le moment.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-300">
              <Users size={16} />
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">Pourquoi c'est utile</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Les meilleures idées viennent souvent du terrain. Cette page nous aide à garder ces signaux visibles, à les classer et à les transformer en actions.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-300">
              <ArrowRight size={16} />
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">Bon réflexe</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Avant de proposer une idée, demande-toi si elle aide vraiment un client, un collègue ou une partie du travail quotidien.
            </p>
          </div>
        </div>

      <NewIdeaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchIdeas} 
      />
      </div>
    </div>
  );
}
