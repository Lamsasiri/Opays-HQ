"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { FlaskConical, Beaker, Lightbulb, Shield, Send, Lock, CheckCircle2 } from 'lucide-react';

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
    <div className="p-8 space-y-10 max-w-5xl mx-auto">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600 bg-purple-50 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-100">
            <Lock size={12} /> Espace Confidentiel
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">OPAYS Labs</h1>
          <p className="text-gray-500 text-lg">Le laboratoire stratégique pour nourrir nos ambitions futures.</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
            <FlaskConical size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</p>
            <p className="text-sm font-bold text-gray-900">Veille Active</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne de Saisie */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-500" /> Nouvelle Intuition Stratégique
            </h2>
            <textarea 
              className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all resize-none"
              placeholder="Décrivez une nouvelle technologie, une vision ou un axe de recherche..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium italic">
                <Shield size={12} /> Seuls les fondateurs ont accès à ces notes.
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 uppercase text-[11px] tracking-widest"
              >
                {loading ? 'Archivage...' : 'Enregistrer'} <Send size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Journal de Recherche</h2>
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Beaker size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(note.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 italic">Aucune note de recherche enregistrée.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne Infos / Vision */}
        <div className="space-y-6">
          <div className="bg-purple-900 text-white rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold">L'Ambition Opays</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              La recherche chez Opays n'est pas faite pour être publiée. Elle est le moteur qui alimente notre souveraineté technologique en RDC.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                { title: "Souveraineté", desc: "Contrôle total des données." },
                { title: "Intelligence", desc: "IA appliquée au terrain local." },
                { title: "Automatisation", desc: "Libérer le potentiel humain." }
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-[11px] text-purple-300">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Outils de Recherche</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Benchmarks', 'Papers', 'Drafts', 'Architecture'].map(tool => (
                <button key={tool} className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100">
                  {tool}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
