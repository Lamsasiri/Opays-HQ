"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, Flame, BarChart3, TrendingUp, Users, Briefcase, CheckSquare, Zap } from 'lucide-react';

const CapacityBar = ({ label, current, target, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px] font-semibold">
      <span className="text-gray-500">{label}</span>
      <span className={current > target ? 'text-red-500' : 'text-gray-400'}>{current}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000`} 
        style={{ width: `${current}%` }}
      />
    </div>
  </div>
);

const StatCard = ({ title, value, icon, change }: { title: string, value: string | number, icon: any, change?: string }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        {change && <p className="text-green-600 text-xs font-medium mt-1">{change} vs mois dernier</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    pipeline: 0,
    leads: 0,
    audits: 0,
    vesting: 0,
    projects: 0,
    tasks: 0,
    studioShare: 0,
    labsShare: 0
  });
  const [projects, setProjects] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: leads } = await supabase.from('leads').select('potential_value, status');
      const pipelineValue = leads?.reduce((acc, l) => acc + (l.potential_value || 0), 0) || 0;
      const auditCount = leads?.filter(l => l.status === 'AUDIT_PENDING').length || 0;

      const { data: projectsData } = await supabase.from('projects').select('*, leads(company_name)').limit(5);
      const { data: allProjects } = await supabase.from('projects').select('id, branch');
      const { data: taskData } = await supabase.from('tasks').select('id, status');

      const { data: logs } = await supabase.from('equity_vesting_logs').select('shares_unlocked');
      const totalVested = logs?.reduce((acc, l) => acc + l.shares_unlocked, 0) || 0;
      const studioCount = allProjects?.filter((project) => project.branch === 'STUDIO').length || 0;
      const labsCount = allProjects?.filter((project) => project.branch === 'LABS').length || 0;
      const totalCount = Math.max(allProjects?.length || 0, 1);
      const studioShare = Math.round((studioCount / totalCount) * 100);
      const labsShare = Math.round((labsCount / totalCount) * 100);

      setStats({
        pipeline: pipelineValue,
        leads: leads?.length || 0,
        audits: auditCount,
        vesting: totalVested,
        projects: allProjects?.length || 0,
        tasks: taskData?.filter((task) => task.status !== 'DONE').length || 0,
        studioShare,
        labsShare
      });
      if (projectsData) setProjects(projectsData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 mt-1 text-sm">Bienvenue sur le centre de commandement d'OPAYS TECH.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Leads Actifs" value={stats.leads} icon={<Users size={20} />} />
          <StatCard title="Projets en cours" value={stats.projects} icon={<Briefcase size={20} />} />
          <StatCard title="Tâches Todo" value={stats.tasks} icon={<CheckSquare size={20} />} />
          <StatCard title="Audits en cours" value={stats.audits} icon={<Zap size={20} />} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Allocation Capacité</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold">LIVE</span>
          </div>
          
          <div className="space-y-4">
            <CapacityBar label="Studio (70%)" current={stats.studioShare || 0} target={70} color="bg-blue-500" />
            <CapacityBar label="Labs (20%)" current={stats.labsShare || 0} target={20} color="bg-purple-500" />
            <CapacityBar label="Buffer (10%)" current={Math.max(0, 100 - (stats.studioShare + stats.labsShare))} target={10} color="bg-gray-300" />
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 italic leading-relaxed">
              {stats.labsShare > 20
                ? "⚠️ Les Labs dépassent l'allocation cible."
                : "✓ Allocation conforme au cadre 70/20/10."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Projets Récents</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div>
                  <p className="font-semibold text-gray-900">{project.title}</p>
                  <p className="text-sm text-gray-500">{project.leads?.company_name} • Échéance : {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">
                  {project.status}
                </span>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-400 italic py-10 text-center">Aucun projet actif.</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Objectifs Collectifs</h2>
          <div className="space-y-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Croissance Pipeline</span>
              <span className="font-semibold text-gray-900">75%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "L'efficience n'est pas une destination, c'est un processus continu."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
