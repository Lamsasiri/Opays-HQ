"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { FlaskConical, Beaker, Lightbulb, Shield, Send, Lock, CheckCircle2, Sparkles } from 'lucide-react';

export default function LabsPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('*, profiles(full_name)')
      .eq('category', 'RESEARCH')
      .order('created_at', { ascending: false });
    if (data) setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('ideas').insert([{
      title: 'Note de Recherche',
      content: newNote,
      category: 'RESEARCH',
      profile_id: user?.id,
      status: 'PRIVATE'
    }]);

    if (!error) {
      setNewNote('');
      fetchNotes();
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-full text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-10 p-6 md:p-8">
        <header className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-start">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">
            <Lock size={12} /> Espace Confidentiel
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">OPAYS Labs</h1>
            <p className="max-w-2xl text-sm text-slate-500 font-medium">Le laboratoire stratégique pour nourrir nos ambitions futures et préparer les paris technologiques à fort impact.</p>
          </div>
          <div className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-2xl bg-violet-100 p-2 text-violet-600">
            <FlaskConical size={24} />
          </div>
          <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Statut</p>
              <p className="text-sm font-bold text-slate-900">Veille Active</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Lightbulb size={20} className="text-amber-500" /> Nouvelle Intuition Stratégique
              </h2>
              <textarea 
                className="h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 transition-all"
                placeholder="Décrivez une nouvelle technologie, une vision ou un axe de recherche..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Shield size={12} className="text-violet-500" /> Accès restreint aux associés
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-white shadow-lg shadow-violet-500/20 transition hover:opacity-95 disabled:opacity-50"
                >
                  {loading ? 'Archivage...' : 'Enregistrer'} <Send size={16} />
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <h2 className="px-4 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Journal de Recherche</h2>
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md transition-all">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                          <Beaker size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                          {new Date(note.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <Sparkles size={16} className="text-violet-400" />
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">{note.content}</p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="rounded-[2rem] border border-dashed border-slate-200 py-20 text-center bg-white/50">
                    <p className="italic text-slate-400">Aucune note de recherche enregistrée.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-600 to-fuchsia-700 p-8 text-white shadow-xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <h3 className="text-xl font-semibold">L'Ambition Opays</h3>
              <p className="mt-3 text-sm leading-relaxed text-violet-100">
                La recherche chez Opays n'est pas faite pour être publiée. Elle alimente notre souveraineté technologique et nos futurs produits.
              </p>
              <ul className="space-y-4 pt-6">
                {[
                  { title: "Souveraineté", desc: "Contrôle total des données." },
                  { title: "Intelligence", desc: "IA appliquée au terrain local." },
                  { title: "Automatisation", desc: "Libérer le potentiel humain." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-inner">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-[11px] text-violet-200 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Outils de Recherche</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Benchmarks', 'Papers', 'Drafts', 'Architecture'].map(tool => (
                  <button key={tool} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 shadow-sm">
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
