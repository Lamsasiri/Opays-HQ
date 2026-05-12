"use client";

import React, { useState } from 'react';
import { X, Lightbulb, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewIdeaModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'TECH' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('ideas').insert([{ ...formData, status: 'PROPOSED', votes: 0 }]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de la soumission"); }
  };

  const inputClass = "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Lightbulb size={18} className="text-cyan-300" /> Proposer une idée utile
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Titre *</label>
            <input required type="text" className={inputClass} placeholder="Votre idée en une phrase" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Catégorie</label>
            <select className={inputClass} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="TECH">Tech / R&D</option>
              <option value="SALES">Ventes / Marketing</option>
              <option value="OPS">Opérations</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Description</label>
            <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Décrivez votre idée, son impact potentiel..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-50">
              <Sparkles size={16} />
              {loading ? 'Envoi...' : 'Soumettre l\'idée'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
