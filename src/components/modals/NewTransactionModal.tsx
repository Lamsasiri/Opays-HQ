"use client";

import React, { useState } from 'react';
import { X, DollarSign, FileText, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewTransactionModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'INCOME',
    date: new Date().toISOString().split('T')[0]
  });

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('treasury_logs').insert([{
      ...formData,
      amount: parseFloat(formData.amount)
    }]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de l'enregistrement de la transaction"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={18} className="text-blue-600" /> Nouvelle Transaction
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, type: 'INCOME'})}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
            >
              <ArrowUpRight size={14} /> Revenu
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, type: 'EXPENSE'})}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
            >
              <ArrowDownRight size={14} /> Dépense
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type="text" className={inputClass} placeholder="Ex: Paiement Serveurs, Achat Matériel..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="number" className={inputClass} placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="date" className={inputClass} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
