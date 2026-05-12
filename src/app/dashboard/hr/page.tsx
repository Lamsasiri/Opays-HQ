"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { UserCircle, FileText, Target, BarChart3, Download, Award, Users } from 'lucide-react';
import AdminHRView from '@/components/AdminHRView';

export default function HRPage() {
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [view, setView] = useState<'SELF' | 'ADMIN'>('SELF');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      const { data: recordData } = await supabase
        .from('hr_records')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      setRecords(recordData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  const isAdmin = ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '') || profile?.permissions?.hr;

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {view === 'SELF' ? 'Mon Espace RH' : 'Gestion du Personnel'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {view === 'SELF' ? 'Gérez vos documents administratifs et vos fiches de paie.' : 'Supervisez l\'équipe et la masse salariale.'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
            <button 
              onClick={() => setView('SELF')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${view === 'SELF' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Ma Fiche
            </button>
            <button 
              onClick={() => setView('ADMIN')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${view === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Users size={14} /> Vue Admin
            </button>
          </div>
        )}
      </header>

      {view === 'ADMIN' ? (
        <AdminHRView />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-400 mb-4">
                <Target size={20} />
                <span className="text-sm font-medium">Performance Actuelle</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold text-gray-900">{records?.[0]?.performance_score || 0}%</h3>
                <span className="text-gray-400 text-sm">Score global</span>
              </div>
              <div className="mt-6 w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${records?.[0]?.performance_score || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-400 mb-4">
                <BarChart3 size={20} />
                <span className="text-sm font-medium">Salaire Mensuel</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900">{(profile?.salary_amount || 0).toLocaleString()} $</h3>
              <p className="text-xs text-gray-400 mt-2">Versé le 1er du mois (Net à payer).</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-400 mb-4">
                <Award size={20} />
                <span className="text-sm font-medium">Grade / Rôle</span>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-gray-900">{profile?.role || 'Membre'}</h3>
              <p className="text-xs text-gray-400 mt-2">Membre depuis le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '?'}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText size={20} /> Mes Documents & Fiches de paie
            </h2>
            <div className="space-y-3">
              {records?.filter(r => r.document_url).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg group-hover:text-blue-600 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Fiche de paie - {new Date(record.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-400">{record.review_notes || 'Document administratif'}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}

              {!records?.filter(r => r.document_url).length && (
                <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-400 italic text-sm">Aucun document administratif disponible.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
