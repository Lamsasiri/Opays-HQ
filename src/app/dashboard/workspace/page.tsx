"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { Activity, ArrowRight, Box, CheckCircle2, Briefcase, Database, Globe, Layers3, Lock, Monitor, Plus, ShieldCheck, Sparkles, Terminal, Zap } from 'lucide-react';
import NewTaskModal from '@/components/modals/NewTaskModal';
import NewProjectModal from '@/components/modals/NewProjectModal';

type ProjectRow = {
  id: string;
  title: string;
  status: string;
  tech_stack: string[] | null;
};

type TaskRow = {
  title: string;
  status: string;
  updated_at: string;
  projects?: { title: string } | { title: string }[] | null;
};

export default function WorkspacePage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setIsRefreshing(true);

      const [{ data: projectData }, { data: taskData }] = await Promise.all([
        supabase.from('projects').select('id, title, status, tech_stack').order('created_at', { ascending: false }).limit(4),
        supabase.from('tasks').select('title, status, updated_at, projects(title)').order('updated_at', { ascending: false }).limit(6),
      ]);

      setProjects((projectData || []) as ProjectRow[]);
      setTasks((taskData || []) as TaskRow[]);
      setLastSync(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
    };

    fetchWorkspaceData();
  }, [supabase]);

  const activeTasks = tasks.filter((task) => task.status !== 'DONE').length;

  const statusPill = (label: string, tone: 'emerald' | 'cyan' | 'slate') => {
    const styles = {
      emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
      cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
      slate: 'border-slate-200 bg-slate-100 text-slate-500',
    } as const;

    return (
      <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] ${styles[tone]}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative space-y-8">
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">
              <Monitor size={12} /> Workspace
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
                Espace d'exécution technique
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-500 font-medium">
                Votre cockpit d'ingénierie : projets actifs, tâches ouvertes, stack technique et état d'infrastructure en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-cyan-600">
              <Terminal size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Actions rapides</p>
              <div className="mt-1 flex gap-2">
                <button onClick={() => setShowTaskModal(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50">
                  <Plus size={12} /> Tâche
                </button>
                <button onClick={() => setShowProjectModal(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50">
                  <Briefcase size={12} /> Projet
                </button>
                <Link href="/dashboard/ai" className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-100 bg-cyan-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-cyan-700 shadow-md">
                  <Sparkles size={12} /> IA
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Projets actifs', value: projects.length, icon: <Layers3 size={18} />, tone: 'cyan' as const },
            { label: 'Tâches ouvertes', value: activeTasks, icon: <Activity size={18} />, tone: 'emerald' as const },
            { label: 'Dernière sync', value: lastSync || 'En cours', icon: <Zap size={18} />, tone: 'slate' as const },
            { label: 'RBAC / RLS', value: 'Actif', icon: <ShieldCheck size={18} />, tone: 'cyan' as const },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-slate-600">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Projets en cours</h2>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Surface de livraison</p>
              </div>
              <Link href="/dashboard/projects" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-cyan-300 hover:bg-white hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 group-hover:text-cyan-600">{project.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    {statusPill(project.status, project.status === 'COMPLETED' ? 'emerald' : 'cyan')}
                    <ArrowRight size={16} className="text-slate-300 transition group-hover:text-cyan-600" />
                  </div>
                </Link>
              ))}

              {projects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-400 italic">
                  Aucun projet détecté.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-cyan-600">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Infrastructure</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Santé du système</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-cyan-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">API / Edge</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Vercel / Next.js</p>
                    </div>
                  </div>
                  {statusPill('Live', 'emerald')}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Database size={18} className="text-violet-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Base de données</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Supabase + RLS</p>
                    </div>
                  </div>
                  {statusPill('Secured', 'cyan')}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-amber-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Permissions</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">JSONB + RBAC</p>
                    </div>
                  </div>
                  {statusPill('Active', 'slate')}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-cyan-200 bg-white p-3 text-cyan-600 shadow-sm">
                  <Box size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-cyan-900 uppercase tracking-tight">Le saviez-vous ?</h3>
                  <p className="mt-2 text-sm leading-6 text-cyan-800 font-medium">
                    Ce workspace est synchronisé directement avec l'infrastructure. Chaque changement est audité en temps réel pour garantir la sécurité de vos données.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Activité récente</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Derniers changements sur les tâches</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => {
              const project = Array.isArray(task.projects) ? task.projects[0] : task.projects;

              return (
                <div key={`${task.title}-${task.updated_at}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 hover:bg-white hover:border-slate-200 transition-all cursor-default">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{task.title}</p>
                    <p className="mt-1 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      {project?.title || 'Sans projet'} • {new Date(task.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {statusPill(task.status, task.status === 'DONE' ? 'emerald' : 'slate')}
                </div>
              );
            })}
            {tasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-400 italic">
                Aucune tâche récente.
              </div>
            )}
          </div>
        </section>
      </motion.div>

      <NewTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSuccess={() => window.location.reload()}
      />
      <NewProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
