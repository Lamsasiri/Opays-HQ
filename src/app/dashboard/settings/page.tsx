"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { Settings, UserPlus, FileUp, Users, Lock, DollarSign, ShieldCheck, Eye, Wallet, BarChart3, Shield, TrendingUp } from 'lucide-react';
import AccessControlModal from '@/components/modals/AccessControlModal';
import AssignEquityModal from '@/components/modals/AssignEquityModal';
import AssociateDocumentsModal from '@/components/modals/AssociateDocumentsModal';
import { useProfile } from '@/lib/ProfileProvider';

export default function SettingsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isEquityModalOpen, setIsEquityModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { profile, isCEO, isManager } = useProfile();

  const fetchData = async () => {
    setLoading(true);

    const { data: membersData } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
    setMembers(membersData || []);

    const { data: docsData } = await supabase.from('global_documents').select('*').order('created_at', { ascending: false });
    setDocs(docsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAccessControl = (member: any) => {
    setSelectedMember(member);
    setIsAccessModalOpen(true);
  };

  if (loading && !profile) return <div className="p-8">Chargement du centre de pilotage...</div>;

  return (
    <div className="p-8 space-y-10">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Settings size={12} /> Paramètres
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Centre de Pilotage</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {isCEO 
            ? "Gérez l'équipe, les accès, les budgets et les documents importants."
            : "Consultez les paramètres accessibles selon votre rôle."}
        </p>
      </header>

      {/* ═══ SECTION CEO : Gestion de l'équipe ═══ */}
      {isCEO && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inviter un membre */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UserPlus className="text-blue-600" size={22} />
              <h2 className="text-lg font-bold text-gray-900">Inviter un Membre</h2>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="email@opays.tech" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500">
                    <option value="SALES">Commercial</option>
                    <option value="ENGINEER">Ingénieur</option>
                    <option value="CTO">CTO</option>
                    <option value="COO">COO</option>
                    <option value="INVESTOR">Investisseur</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Parts (%)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Salaire ($)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type de contrat</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500">
                  <option value="ASSOCIATE">Associé (parts + salaire)</option>
                  <option value="EMPLOYEE">Employé (salaire uniquement)</option>
                </select>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                Envoyer l'invitation
              </button>
            </form>
          </div>

          {/* Documents importants */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileUp className="text-purple-600" size={22} />
              <h2 className="text-lg font-bold text-gray-900">Documents Importants</h2>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre du document</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" placeholder="ex: Contrat type 2026" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qui peut voir ce document ?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Associés', 'Employés', 'CEO', 'CTO', 'Commerciaux'].map(role => (
                    <label key={role} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                      <input type="checkbox" className="accent-blue-600 rounded" /> {role}
                    </label>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all">
                Publier le document
              </button>
            </form>

            {docs && docs.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documents existants</p>
                {docs.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <span className="text-[10px] text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SECTION CEO : Liste des membres ═══ */}
      {isCEO && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users size={20} /> Membres de l'équipe ({members?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members?.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xs font-bold">
                    {m.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{m.full_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{m.role} • {m.type}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openAccessControl(m)}
                    className="p-2.5 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 hover:border-blue-100 shadow-sm transition-all" 
                    title="Gérer les accès"
                  >
                    <Shield size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedMember(m); setIsEquityModalOpen(true); }}
                    className="p-2.5 bg-white text-gray-400 hover:text-green-600 rounded-xl border border-gray-100 hover:border-green-100 shadow-sm transition-all" 
                    title="Gérer les parts sociales"
                  >
                    <TrendingUp size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedMember(m); setIsDocsModalOpen(true); }}
                    className="p-2.5 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 hover:border-blue-100 shadow-sm transition-all" 
                    title="Documents personnalisés"
                  >
                    <FileUp size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SECTION MANAGER : Budget & Objectifs ═══ */}
      {isManager && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={22} />
              <h2 className="text-lg font-bold text-gray-900">Budget Mensuel</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget Total ($)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="10000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Objectif CA ($)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="50000" />
              </div>
            </div>
            <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm">
              Définir le budget
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-orange-500" size={22} />
              <h2 className="text-lg font-bold text-gray-900">Répartition du Travail</h2>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Services (%)</label>
                <input type="number" defaultValue={70} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Innovation (%)</label>
                <input type="number" defaultValue={20} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Réserve (%)</label>
                <input type="number" defaultValue={10} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500" />
              </div>
            </div>
            <button className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-sm">
              Appliquer la répartition
            </button>
          </div>
        </div>
      )}

      {/* ═══ SECTION TOUS : Accès Limité (non-admin) ═══ */}
      {!isManager && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
          <ShieldCheck className="mx-auto text-gray-300" size={48} />
          <h2 className="text-lg font-bold text-gray-900">Accès limité</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Les paramètres avancés sont réservés aux responsables. Contactez votre manager pour toute demande de modification.
          </p>
        </div>
      )}

      <AccessControlModal 
        isOpen={isAccessModalOpen} 
        onClose={() => { setIsAccessModalOpen(false); fetchData(); }} 
        member={selectedMember} 
      />

      <AssignEquityModal
        isOpen={isEquityModalOpen}
        onClose={() => { setIsEquityModalOpen(false); fetchData(); }}
        onSuccess={fetchData}
      />

      <AssociateDocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => { setIsDocsModalOpen(false); fetchData(); }}
        member={selectedMember}
      />
    </div>
  );
}
