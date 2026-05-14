"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Phone, Mail, Building2, MoreHorizontal, Plus, Clock, Target, Trash2, CheckCircle, Trophy, Sparkles, TrendingUp, Shield } from 'lucide-react';
import NewLeadModal from '@/components/modals/NewLeadModal';
import { canAccessPath } from '@/lib/rbac';

const StatusColors: any = {
  'NEW': 'bg-sky-50 text-sky-700 border-sky-100',
  'CONTACTED': 'bg-amber-50 text-amber-700 border-amber-100',
  'AUDIT_PENDING': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  'PROPOSAL_SENT': 'bg-orange-50 text-orange-700 border-orange-100',
  'CLOSED_WON': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'CLOSED_LOST': 'bg-rose-50 text-rose-700 border-rose-100',
  'WON': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);

      if (!canAccessPath(profileData, '/dashboard/leads')) {
        window.location.href = '/dashboard';
        return;
      }

      const { data } = await supabase
        .from('leads')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (data) setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openNew = () => { setSelectedLead(null); setIsModalOpen(true); };
  const openEdit = (lead: any) => { setSelectedLead(lead); setIsModalOpen(true); };

  const convertToProject = async (lead: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Convertir ${lead.company_name} en projet actif ?`)) {
      setLoading(true);
      await supabase.from('leads').update({ status: 'WON' }).eq('id', lead.id);
      const { data: project, error: pError } = await supabase.from('projects').insert([{
        lead_id: lead.id,
        title: `Projet ${lead.company_name}`,
        status: 'PLANNING',
        branch: 'STUDIO',
        tech_stack: ['IA', 'Automation'],
        gross_margin_projected: (lead.potential_value || 0) * 0.4,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }]).select().single();

      if (!pError) {
        alert("Projet créé avec succès !");
        fetchLeads();
      } else {
        alert("Erreur lors de la conversion");
      }
      setLoading(false);
    }
  };

  const deleteLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Supprimer ce prospect ?")) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (!error) fetchLeads();
    }
  };

  const getSlaLabel = (deadline?: string) => {
    if (!deadline) return 'TBD';
    const remainingMs = new Date(deadline).getTime() - Date.now();
    const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
    if (remainingHours <= 0) return 'OVERDUE';
    if (remainingHours <= 24) return `${remainingHours}h restantes`;
    return new Date(deadline).toLocaleString('fr-FR');
  };

  return (
    <div className="relative min-h-full text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">
              <Sparkles size={12} /> Revenue Control Center
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">Mes Prospects</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">Gérez votre pipeline avec une lecture nette du risque, de la valeur et du prochain move commercial.</p>
            </div>
          </div>
          <button 
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
          >
            <Plus size={18} /> Nouveau Prospect
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Total Pipeline</p>
            <h3 className="text-2xl font-semibold text-slate-900">{(leads?.reduce((acc, lead) => acc + (lead.potential_value || 0), 0) || 0).toLocaleString()} $</h3>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">En Audit</p>
            <h3 className="text-2xl font-semibold text-slate-900">{leads?.filter(l => l.status === 'AUDIT_PENDING').length || 0}</h3>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Gagnés</p>
            <h3 className="text-2xl font-semibold text-emerald-600">{leads?.filter(l => ['CLOSED_WON', 'WON'].includes(l.status)).length || 0}</h3>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Total Leads</p>
            <h3 className="text-2xl font-semibold text-slate-900">{leads?.length || 0}</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Entreprise</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Status</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">SLA / Audit</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Valeur Est.</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Assigné à</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => openEdit(lead)}
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 transition-colors group-hover:text-cyan-600">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-900">{lead.company_name}</span>
                        <span className="text-xs text-slate-500">{lead.contact_name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${StatusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {lead.status === 'NEW' && (
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-rose-600">
                          <Clock size={12} /> SLA : {getSlaLabel(lead.sla_qualification_deadline)}
                        </div>
                      )}
                      {lead.status === 'AUDIT_PENDING' && (
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-fuchsia-600">
                          <Target size={12} /> Audit : {lead.audit_deadline ? new Date(lead.audit_deadline).toLocaleDateString() : 'Non planifié'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm font-semibold text-slate-900">{(lead.potential_value || 0).toLocaleString()} $</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {lead.profiles?.full_name || 'Non assigné'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-all group-hover:opacity-100">
                      {lead.status !== 'WON' && (
                        <button 
                          onClick={(e) => convertToProject(lead, e)}
                          className="rounded-xl border border-slate-100 bg-white p-2 text-slate-400 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                          title="Convertir en projet"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {lead.status === 'WON' && <Trophy size={18} className="mr-2 text-amber-500" />}
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEdit(lead); }}
                        className="rounded-xl border border-slate-100 bg-white p-2 text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      <button 
                        onClick={(e) => deleteLead(lead.id, e)}
                        className="rounded-xl border border-slate-100 bg-white p-2 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && !leads.length && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400 italic">
                    Aucun prospect enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-cyan-600 font-bold uppercase tracking-wider text-[10px]">
              <TrendingUp size={16} /> Pipeline prioritaire
            </div>
            <p>Les leads closables sont maintenant lisibles en un coup d'oeil, sans style générique.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-violet-600 font-bold uppercase tracking-wider text-[10px]">
              <Shield size={16} /> Contrôle d'accès
            </div>
            <p>La page suit le RBAC global du dashboard et ne laisse passer que les rôles autorisés.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
              <Phone size={16} /> Suivi commercial
            </div>
            <p>Les signaux d'audit et les SLA ressortent plus clairement pour prioriser les relances.</p>
          </div>
        </div>

        <NewLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchLeads} 
          lead={selectedLead}
        />
      </div>
    </div>
  );
}
