"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Users, Phone, Mail, Building2, MoreHorizontal, Plus, Clock, Target } from 'lucide-react';
import NewLeadModal from '@/components/modals/NewLeadModal';

const StatusColors: any = {
  'NEW': 'bg-blue-50 text-blue-600 border-blue-200',
  'CONTACTED': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'AUDIT_PENDING': 'bg-purple-50 text-purple-600 border-purple-200',
  'PROPOSAL_SENT': 'bg-orange-50 text-orange-600 border-orange-200',
  'CLOSED_WON': 'bg-green-50 text-green-600 border-green-200',
  'CLOSED_LOST': 'bg-red-50 text-red-600 border-red-200',
};

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getSlaLabel = (deadline?: string) => {
    if (!deadline) return 'TBD';
    const remainingMs = new Date(deadline).getTime() - Date.now();
    const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
    if (remainingHours <= 0) return 'OVERDUE';
    if (remainingHours <= 24) return `${remainingHours}h restantes`;
    return new Date(deadline).toLocaleString('fr-FR');
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mes Prospects</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez votre liste de clients potentiels et suivez chaque vente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} /> Nouveau Prospect
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Pipeline</p>
          <h3 className="text-2xl font-bold text-gray-900">{(leads?.reduce((acc, lead) => acc + (lead.potential_value || 0), 0) || 0).toLocaleString()} $</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">En Audit</p>
          <h3 className="text-2xl font-bold text-gray-900">{leads?.filter(l => l.status === 'AUDIT_PENDING').length || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Gagnés</p>
          <h3 className="text-2xl font-bold text-green-600">{leads?.filter(l => l.status === 'CLOSED_WON').length || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Leads</p>
          <h3 className="text-2xl font-bold text-gray-900">{leads?.length || 0}</h3>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Entreprise</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">SLA / Audit</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Valeur Est.</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Assigné à</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900">{lead.company_name}</span>
                      <span className="text-xs text-gray-400">{lead.contact_name}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${StatusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    {lead.status === 'NEW' && (
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-red-500">
                        <Clock size={12} /> SLA : {getSlaLabel(lead.sla_qualification_deadline)}
                      </div>
                    )}
                    {lead.status === 'AUDIT_PENDING' && (
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-500">
                        <Target size={12} /> Audit : {lead.audit_deadline ? new Date(lead.audit_deadline).toLocaleDateString() : 'Non planifié'}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm font-semibold text-gray-900">{(lead.potential_value || 0).toLocaleString()} $</span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {lead.profiles?.full_name || 'Non assigné'}
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && !leads.length && (
              <tr>
                <td colSpan={6} className="p-20 text-center text-gray-400 italic">
                  Aucun prospect enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeads} 
      />
    </div>
  );
}
