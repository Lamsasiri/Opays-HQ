"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Users, UserCircle, Briefcase, TrendingUp, Download, MoreVertical, Plus, Sparkles, DollarSign, Target, Activity } from 'lucide-react';

export default function AdminHRView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEmployees = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*, hr_records(performance_score, created_at)')
      .order('full_name', { ascending: true });
    
    if (profiles) {
      const processed = profiles.map(p => ({
        ...p,
        latest_score: p.hr_records?.[0]?.performance_score || 0
      }));
      setEmployees(processed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Masse Salariale Totale</p>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{(employees.reduce((acc, e) => acc + (e.salary_amount || 0), 0)).toLocaleString()} $ <span className="text-sm text-slate-400 font-medium">/ mois</span></h3>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Collaborateurs</p>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{employees.length} <span className="text-sm text-slate-400 font-medium">Actifs</span></h3>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Users size={20} />
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Score de Performance Moyen</p>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-indigo-600">
              {Math.round(employees.reduce((acc, e) => acc + (e.latest_score || 0), 0) / (employees.length || 1))}%
            </h3>
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <Activity size={20} className="text-indigo-600" /> Registre du Personnel
          </h2>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Download size={14} /> Exporter Rapport
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Collaborateur</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Rôle / Grade</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Salaire</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Performance</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map((emp) => (
                <tr key={emp.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">
                        {emp.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{emp.full_name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{emp.role}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{(emp.salary_amount || 0).toLocaleString()} $</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-24 flex-1 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${emp.latest_score}%` }}></div>
                      </div>
                      <span className="text-[11px] font-black text-slate-900">{emp.latest_score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="rounded-xl p-2 text-slate-300 transition hover:bg-white hover:text-indigo-600 hover:border-indigo-100 border border-transparent shadow-sm hover:shadow-md">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
