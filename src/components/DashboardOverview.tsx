"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, Flame, BarChart3, TrendingUp, Users, Briefcase, CheckSquare, Zap } from 'lucide-react';
import ActivityFeed from '@/components/ActivityFeed';
import Link from 'next/link';
import { useProfile } from '@/lib/ProfileProvider';

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

const StatCard = ({ title, value, icon, href, change }: { title: string, value: string | number, icon: any, href: string, change?: string }) => (
  <a href={href} className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        {change && <p className="text-green-600 text-xs font-medium mt-1">{change} vs mois dernier</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-xl text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
        {icon}
      </div>
    </div>
  </a>
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
  const supabase = useMemo(() => createClient(), []);

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Accueil</h1>
          <p className="text-gray-500 mt-1 text-sm">Bienvenue sur votre centre de gestion OPAYS TECH.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Prospects" value={stats.leads} icon={<Users size={20} />} href="/dashboard/leads" />
          <StatCard title="Projets en cours" value={stats.projects} icon={<Briefcase size={20} />} href="/dashboard/projects" />
          <StatCard title="Tâches à faire" value={stats.tasks} icon={<CheckSquare size={20} />} href="/dashboard/tasks" />
          <StatCard title="Analyses en cours" value={stats.audits} icon={<Zap size={20} />} href="/dashboard/audit" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Répartition du travail</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold">EN DIRECT</span>
          </div>
          
          <div className="space-y-4">
            <CapacityBar label="Services (70%)" current={stats.studioShare || 0} target={70} color="bg-blue-500" />
            <CapacityBar label="Innovation (20%)" current={stats.labsShare || 0} target={20} color="bg-purple-500" />
            <CapacityBar label="Réserve (10%)" current={Math.max(0, 100 - (stats.studioShare + stats.labsShare))} target={10} color="bg-gray-300" />
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 italic leading-relaxed">
              {stats.labsShare > 20
                ? "⚠️ L'innovation prend trop de place sur les services."
                : "✓ La répartition du travail est optimale."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-900">Projets Récents</h2>
            <Link href="/dashboard/projects" className="text-xs text-blue-600 hover:underline transition-all">Tout voir</Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 border border-transparent transition-all group"
              >
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</p>
                  <p className="text-sm text-gray-500">{project.leads?.company_name} • Échéance : {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}</p>
                </div>
                <span className="px-3 py-1 bg-white border border-gray-100 text-blue-600 text-[10px] font-bold rounded-full uppercase shadow-sm">
                  {project.status}
                </span>
              </Link>
            ))}
            {projects.length === 0 && <p className="text-gray-400 italic py-10 text-center">Aucun projet actif.</p>}
          </div>
        </div>

        <ActivityFeed />
      </div>
    </div>
  );
}
