"use client";

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Landmark } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewInvoiceModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    project_id: '',
    amount_total: '',
    amount_paid: '0',
    due_date: '',
    status: 'PENDING'
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
    const { error } = await supabase.from('project_billing').insert([{
      ...formData,
      amount_total: parseFloat(formData.amount_total),
      amount_paid: parseFloat(formData.amount_paid)
    }]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de la création de la facture"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={18} className="text-green-600" /> Nouvelle Facture
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projet</label>
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm appearance-none"
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant Total ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="number" className={inputClass} placeholder="0" value={formData.amount_total} onChange={(e) => setFormData({...formData, amount_total: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Déjà Payé ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                <input type="number" className={inputClass} placeholder="0" value={formData.amount_paid} onChange={(e) => setFormData({...formData, amount_paid: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Échéance</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type="date" className={inputClass} value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Création...' : 'Émettre la Facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
