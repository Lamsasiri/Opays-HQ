"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Radio, Users, Calendar, Target, TrendingUp, ChevronRight, MessageSquare, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CoordinationPage() {
  const [salesActivity, setSalesActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({ leads: 0, actions: 0, won: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    // Fetch last activities from leads and their profiles
    const { data: activities } = await supabase
      .from('leads')
      .select('*, profiles(full_name, avatar_url)')
      .order('updated_at', { ascending: false })
      .limit(10);
    
    if (activities) setSalesActivity(activities);

    // Fetch stats
    const { data: leads } = await supabase.from('leads').select('status');
    if (leads) {
      setStats({
        leads: leads.length,
        actions: leads.filter(l => l.status === 'CONTACTED' || l.status === 'AUDIT_PENDING').length,
        won: leads.filter(l => l.status === 'WON' || l.status === 'CLOSED_WON').length
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Radio size={20} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Opérations en Direct</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Command Center</h1>
          <p className="text-gray-500 mt-1">Coordination des descentes terrain et du pipeline commercial.</p>
        </div>
        <Link href="/dashboard/calendar" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Calendar size={18} /> Planifier une descente
        </Link>
      </header>

      {/* Stats Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Leads Actifs', value: stats.leads, icon: <Users size={20} />, color: 'blue' },
          { label: 'Descentes Prévues', value: '4', icon: <MapPin size={20} />, color: 'purple' },
          { label: 'Audits en Cours', value: stats.actions, icon: <Target size={20} />, color: 'orange' },
          { label: 'Conversion (WON)', value: stats.won, icon: <TrendingUp size={20} />, color: 'green' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl w-fit mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flux des descentes terrain */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-gray-400" /> Flux d'activité des Associés (Patricia & Zaina)
          </h2>
          <div className="space-y-4">
            {salesActivity.map((activity) => (
              <div key={activity.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-all shadow-sm group">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {activity.profiles?.full_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{activity.profiles?.full_name}</span>
                        <span className="text-gray-400 text-xs">sur</span>
                        <span className="font-bold text-blue-600">{activity.company_name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Dernière mise à jour du statut : <span className="font-semibold text-gray-700">{activity.status}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                          <Calendar size={10} /> {new Date(activity.updated_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                          <MapPin size={10} /> Descente effectuée
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/leads?id=${activity.id}`}
                    className="p-2 text-gray-300 group-hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coordination & Affectation */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Radio size={80} />
            </div>
            <h3 className="text-xl font-bold mb-4">Rôle du Chef Comm</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Prince, votre mission est de coordonner les goulots identifiés par Patricia et Zaina pour planifier les audits avec l'équipe technique.
            </p>
            <div className="space-y-4">
              <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all">
                Affecter un nouveau Lead
              </button>
              <button className="w-full py-3 bg-white/10 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all">
                Consulter les Rapports d'Audit
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Pipeline de Prince</h3>
            <div className="space-y-4">
              {[
                { name: 'Patricia', stats: '3 Leads actifs • 1 Audit prévu', color: 'green' },
                { name: 'Zaina', stats: '5 Leads actifs • 0 Audit prévu', color: 'blue' }
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{member.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{member.stats}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full bg-${member.color}-500 animate-pulse`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
