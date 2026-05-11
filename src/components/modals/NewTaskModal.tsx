"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewTaskModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const supabase = createClient();
  const [formData, setFormData] = useState({ title: '', project_id: '', priority: 'MEDIUM', due_date: '' });

  useEffect(() => {
    if (isOpen) {
      supabase.from('projects').select('id, title').then(({ data }) => { if (data) setProjects(data); });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('tasks').insert([{ ...formData, status: 'TODO' }]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de la création de la tâche"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-600" /> Nouvelle Tâche
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre *</label>
            <input required type="text" className={inputClass} placeholder="Que faut-il faire ?" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projet</label>
              <select className={inputClass} value={formData.project_id} onChange={(e) => setFormData({...formData, project_id: e.target.value})}>
                <option value="">Sans projet</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priorité</label>
              <select className={inputClass} value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Échéance</label>
            <input type="date" className={inputClass} value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Création...' : 'Créer la Tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
