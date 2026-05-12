"use client";

import React, { useState } from 'react';
import { X, Handshake, Mail, Globe, User } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function NewPartnerModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'TECHNOLOGY',
    status: 'ACTIVE',
    contact_email: '',
    website: ''
  });

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('partnerships').insert([formData]);
    setLoading(false);
    if (!error) { onSuccess(); onClose(); }
    else { alert("Erreur lors de l'ajout du partenaire"); }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Handshake size={18} className="text-blue-600" /> Nouveau Partenaire
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom de l'Organisation</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type="text" className={inputClass} placeholder="Nom du partenaire" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="TECHNOLOGY">Technologique</option>
                <option value="STRATEGIC">Stratégique</option>
                <option value="FINANCIAL">Financier</option>
                <option value="CLIENT">Client VIP</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:border-blue-500 outline-none transition-all text-sm" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="ACTIVE">Actif</option>
                <option value="PENDING">En attente</option>
                <option value="INACTIVE">Inactif</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email de Contact</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="email" className={inputClass} placeholder="contact@partenaire.com" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Site Web</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="url" className={inputClass} placeholder="https://..." value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-[2] py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm text-sm">
              {loading ? 'Ajout...' : 'Ajouter le Partenaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
