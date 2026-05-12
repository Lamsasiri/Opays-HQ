"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Save, BookOpen } from 'lucide-react';

export default function NewKnowledgeModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'METHOD',
    content: ''
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('knowledge_articles').insert([formData]);
    if (!error) {
      onSuccess();
      onClose();
      setFormData({ title: '', category: 'METHOD', content: '' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Nouveau Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre du Guide</label>
            <input 
              required
              type="text"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              placeholder="Ex: Méthodologie Audit Flash"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="METHOD">Méthodologie</option>
              <option value="GUIDE">Guide Pratique</option>
              <option value="VISION">Vision Stratégique</option>
              <option value="TECH">Documentation Tech</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contenu (Markdown supporté)</label>
            <textarea 
              required
              rows={8}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              placeholder="Décrivez les étapes ou la vision ici..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-2 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Save size={20} /> {loading ? 'Enregistrement...' : 'Publier le Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
