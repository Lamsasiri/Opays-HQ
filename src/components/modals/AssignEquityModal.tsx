"use client";

import React, { useState, useEffect } from 'react';
import { X, UserPlus, TrendingUp, FileText, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function AssignEquityModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    profile_id: '',
    equity_percent: 0,
    equity_agreement_url: ''
  });

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('id, full_name, role');
        if (data) setUsers(data);
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.rpc('admin_update_profile_equity', {
      target_profile_id: formData.profile_id,
      next_equity_percent: formData.equity_percent,
    });

    if (!error && formData.equity_agreement_url) {
      // We could log the agreement in equity_vesting_logs with 0 shares as a record
      await supabase.from('equity_vesting_logs').insert([{
        profile_id: formData.profile_id,
        shares_unlocked: 0,
        month: new Date().toISOString(),
        contribution_notes: `Signature du pacte d'associé : ${formData.equity_agreement_url}`
      }]);
    }

    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de l'attribution des parts"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Attribuer des Parts Sociales
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={18} className="text-blue-600 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Cette action transforme l'utilisateur en <strong>Associé</strong> et définit sa cible de capital. Les parts seront débloquées mensuellement via le flux de vesting.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Choisir un Collaborateur</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm"
                value={formData.profile_id}
                onChange={(e) => setFormData({...formData, profile_id: e.target.value})}
              >
                <option value="">Sélectionner...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parts Cibles (%)</label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                required 
                type="number" 
                step="0.01"
                className={inputClass} 
                placeholder="Ex: 5.00" 
                value={formData.equity_percent} 
                onChange={(e) => setFormData({...formData, equity_percent: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Document d'Associé (Lien)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                required 
                type="url" 
                className={inputClass} 
                placeholder="Lien vers le pacte d'associé signé..." 
                value={formData.equity_agreement_url} 
                onChange={(e) => setFormData({...formData, equity_agreement_url: e.target.value})} 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors text-xs uppercase tracking-widest">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 text-xs uppercase tracking-widest">
              {loading ? 'Attribution...' : 'Confirmer l\'Attribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
