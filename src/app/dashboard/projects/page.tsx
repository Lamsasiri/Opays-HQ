"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { Briefcase, Calendar, DollarSign, ShieldCheck, TrendingDown, Trash2, Layout, FileText, Sparkles, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/lib/ProfileProvider';
import NewProjectModal from '@/components/modals/NewProjectModal';

const StatusColors: any = {
  PLANNING: 'text-slate-600 bg-slate-100 border-slate-200',
  IN_PROGRESS: 'text-sky-700 bg-sky-50 border-sky-100',
  TESTING: 'text-violet-700 bg-violet-50 border-violet-100',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  MAINTENANCE: 'text-amber-700 bg-amber-50 border-amber-100',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { checkAccess, isAssociate } = useProfile();

  const fetchData = async () => {
    setLoading(true);
    const { data: projectsData } = await supabase.from('projects').select('*, leads(company_name)').order('due_date', { ascending: true });
    if (projectsData) setProjects(projectsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer ce projet ?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const canSeeFinancials = isAssociate || checkAccess('treasury') || checkAccess('billing');
  const activeCount = projects.filter((project) => project.status !== 'COMPLETED').length;

  return (
    <div className="relative min-h-full text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 space-y-8 p-6 md:p-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">
              <Sparkles size={12} /> Production
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Nos projets</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Une vue claire de la production, des échéances et des points de suivi pour garder l'équipe alignée.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              {activeCount} projets actifs
            </div>
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
            >
              <Plus size={16} /> Nouveau projet
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Lecture rapide</p>
            <h3 className="text-lg font-semibold text-slate-900">Avancement visible</h3>
            <p className="mt-2 text-sm text-slate-500">Chaque projet doit dire immédiatement où on en est et ce qui reste à faire.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Clarté</p>
            <h3 className="text-lg font-semibold text-slate-900">Rôles et priorités</h3>
            <p className="mt-2 text-sm text-slate-500">La page aide à savoir quoi livrer, quand, et pour quel client.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Sérieux</p>
            <h3 className="text-lg font-semibold text-slate-900">Suivi financier optionnel</h3>
            <p className="mt-2 text-sm text-slate-500">Les informations sensibles restent visibles aux bons rôles seulement.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex flex-col gap-8 xl:flex-row">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] ${project.branch === 'STUDIO' ? 'text-cyan-700 bg-cyan-50 border-cyan-100' : 'text-violet-700 bg-violet-50 border-violet-100'}`}>
                          {project.branch === 'STUDIO' ? 'Services' : 'Innovation'}
                        </span>
                        <Link href={`/dashboard/projects/${project.id}`} className="text-xl font-semibold tracking-tight text-slate-900 transition hover:text-cyan-600">
                          {project.title}
                        </Link>
                      </div>
                      <p className="text-sm text-slate-500">
                        Client : <span className="font-medium text-slate-700">{project.leads?.company_name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] ${StatusColors[project.status]}`}>
                        {project.status}
                      </span>
                      <button onClick={(e) => deleteProject(project.id, e)} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech: string) => (
                      <span key={tech} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Étapes de validation</p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {project.definition_of_done?.length ? (
                        project.definition_of_done.map((step: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-slate-400">
                              {i + 1}
                            </div>
                            {step}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs italic text-slate-400">Aucune étape de validation définie.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 xl:w-80 xl:border-l xl:border-slate-100 xl:pl-8">
                  {canSeeFinancials ? (
                    <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-inner">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                          <DollarSign size={12} /> Marge prévisionnelle
                        </p>
                        <p className="text-xl font-semibold text-emerald-600">{(project.gross_margin_projected || 0).toLocaleString()} $</p>
                      </div>
                      <div className="space-y-1 border-t border-slate-200 pt-3">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                          <TrendingDown size={12} className="text-rose-500" /> Marge réelle
                        </p>
                        <p className={`text-xl font-semibold ${(project.gross_margin_real || 0) < (project.gross_margin_projected || 0) ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {(project.gross_margin_real || 0).toLocaleString()} $
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-inner">
                      <ShieldCheck size={28} className="text-slate-300" />
                      <p className="mt-3 text-xs text-slate-400">Données financières restreintes.</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-1">
                    <Link href={`/dashboard/projects/${project.id}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.28em] text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95">
                      <Layout size={14} /> Ouvrir le projet
                    </Link>
                    <Link href={`/dashboard/contracts?project_id=${project.id}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-600 transition hover:bg-slate-50">
                      <FileText size={14} /> Voir les contrats
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!loading && !projects.length && (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
              <Briefcase size={48} className="mx-auto text-slate-300" />
              <p className="mt-4 text-slate-400 italic">Aucun projet actif.</p>
            </div>
          )}
        </div>
      </div>

      <NewProjectModal
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
