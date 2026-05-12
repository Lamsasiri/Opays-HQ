"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Users, UserCircle, Briefcase, TrendingUp, Download, MoreVertical, Plus } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Masse Salariale Est.</p>
          <h3 className="text-2xl font-bold text-gray-900">{(employees.reduce((acc, e) => acc + (e.salary_amount || 0), 0)).toLocaleString()} $ / mois</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Effectif Total</p>
          <h3 className="text-2xl font-bold text-gray-900">{employees.length} Collaborateurs</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Score Performance Moyen</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {Math.round(employees.reduce((acc, e) => acc + (e.latest_score || 0), 0) / (employees.length || 1))}%
          </h3>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collaborateur</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rôle / Grade</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salaire</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {emp.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{emp.full_name}</p>
                      <p className="text-[11px] text-gray-400">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 px-2.5 py-1 bg-gray-100 rounded-lg uppercase tracking-wider">{emp.role}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{(emp.salary_amount || 0).toLocaleString()} $</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${emp.latest_score}%` }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{emp.latest_score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-300 hover:text-gray-600 rounded-lg">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
