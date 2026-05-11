"use client";

import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
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

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb size={18} className="text-yellow-500" /> Proposer une Idée
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre *</label>
            <input required type="text" className={inputClass} placeholder="Votre idée en une phrase" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
            <select className={inputClass} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="TECH">Tech / R&D</option>
              <option value="SALES">Ventes / Marketing</option>
              <option value="OPS">Opérations</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Décrivez votre idée, son impact potentiel..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Envoi...' : 'Soumettre l\'idée'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
