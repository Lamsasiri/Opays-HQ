"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, Link as LinkIcon, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewContractModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    project_id: '',
    version: '1.0',
    url: '',
    signed_at: new Date().toISOString().split('T')[0]
  });

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('id, title');
        if (data) setProjects(data);
      };
      fetchProjects();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('project_contracts').insert([formData]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de l'ajout du contrat"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" /> Nouveau Contrat
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projet</label>
            <select 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm"
              value={formData.project_id}
              onChange={(e) => setFormData({...formData, project_id: e.target.value})}
            >
              <option value="">Sélectionner un projet</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Version</label>
              <input type="text" className={inputClass} value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date de Signature</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="date" className={inputClass} value={formData.signed_at} onChange={(e) => setFormData({...formData, signed_at: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lien du Document (URL)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type="url" className={inputClass} placeholder="https://..." value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Ajout...' : 'Ajouter le Contrat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
