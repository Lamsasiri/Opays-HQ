"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Briefcase, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewProjectModal({ isOpen, onClose, onSuccess }: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branch, setBranch] = useState<'STUDIO' | 'LABS'>('STUDIO');
  const [dueDate, setDueDate] = useState('');
  const [leadId, setLeadId] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (isOpen) {
      supabase.from('leads').select('id, company_name').then(({ data }) => {
        if (data) setLeads(data);
      });
    }
  }, [isOpen, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('projects').insert({
      title: title.trim(),
      description: description.trim() || null,
      branch,
      due_date: dueDate || null,
      lead_id: leadId || null,
      status: 'PLANNING',
    });

    if (!error) {
      setTitle('');
      setDescription('');
      setBranch('STUDIO');
      setDueDate('');
      setLeadId('');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-6 top-6 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Nouveau Projet</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Production</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Titre du projet *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Refonte site web Client X"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectifs, périmètre, livrables..."
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Branche</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as 'STUDIO' | 'LABS')}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-cyan-500/40"
                  >
                    <option value="STUDIO">Services (Studio)</option>
                    <option value="LABS">Innovation (Labs)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Échéance</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-cyan-500/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Client (Lead associé)</label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option value="">Aucun client</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>{lead.company_name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-sm font-bold uppercase tracking-[0.28em] text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Briefcase size={16} />}
                {loading ? 'Création...' : 'Créer le projet'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
