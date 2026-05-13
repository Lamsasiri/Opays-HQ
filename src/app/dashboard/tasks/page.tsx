"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Filter, X, Calendar, User, Briefcase, GripVertical, Clock, AlertTriangle, ArrowUp, ChevronDown } from 'lucide-react';
import NewTaskModal from '@/components/modals/NewTaskModal';

type TaskStatus = 'TODO' | 'DOING' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  project_id: string | null;
  created_at: string;
  projects?: { title: string } | null;
  profiles?: { full_name: string } | null;
  task_comments?: any[];
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: string; border: string; tint: string }> = {
  TODO: { label: 'À faire', badge: 'border-slate-200 bg-slate-50 text-slate-500', border: 'border-slate-200', tint: 'from-slate-100/50' },
  DOING: { label: 'En cours', badge: 'border-cyan-200 bg-cyan-50 text-cyan-700', border: 'border-cyan-200', tint: 'from-cyan-50/50' },
  DONE: { label: 'Terminé', badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', border: 'border-emerald-200', tint: 'from-emerald-50/50' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: React.ReactNode; color: string }> = {
  LOW: { label: 'Basse', icon: <ChevronDown size={12} />, color: 'text-slate-400' },
  MEDIUM: { label: 'Moyenne', icon: <Clock size={12} />, color: 'text-amber-600' },
  HIGH: { label: 'Haute', icon: <ArrowUp size={12} />, color: 'text-orange-600' },
  URGENT: { label: 'Urgent', icon: <AlertTriangle size={12} />, color: 'text-red-600' },
};

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [assignees, setAssignees] = useState<{ id: string; full_name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const supabase = useMemo(() => createClient(), []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*, projects(title), profiles(full_name), task_comments(*, profiles(full_name))')
      .order('due_date', { ascending: true });
    if (data) setTasks(data as Task[]);
    setLoading(false);
  }, [supabase]);

  const fetchFilterOptions = useCallback(async () => {
    const { data: profilesData } = await supabase.from('profiles').select('id, full_name').order('full_name');
    const { data: projectsData } = await supabase.from('projects').select('id, title').order('title');
    setAssignees(profilesData || []);
    setProjects(projectsData || []);
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
    fetchFilterOptions();
  }, [fetchTasks, fetchFilterOptions]);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (filterAssignee && task.assigned_to !== filterAssignee) return false;
    if (filterProject && task.project_id !== filterProject) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  }), [tasks, filterAssignee, filterProject, filterPriority]);

  const hasFilters = filterAssignee || filterProject || filterPriority;
  const clearFilters = () => {
    setFilterAssignee('');
    setFilterProject('');
    setFilterPriority('');
  };

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDropTarget(status);
  };
  const handleDragLeave = () => setDropTarget(null);

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDropTarget(null);
    if (!draggedTask) return;

    const task = tasks.find((item) => item.id === draggedTask);
    if (!task || task.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    setTasks((prev) => prev.map((item) => (item.id === draggedTask ? { ...item, status: newStatus } : item)));
    setDraggedTask(null);

    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', draggedTask);
    if (error) {
      setTasks((prev) => prev.map((item) => (item.id === draggedTask ? { ...item, status: task.status } : item)));
    }
  };

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter((task) => task.status === status);

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative space-y-6">
        <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">Mes tâches</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">Suivez vos objectifs opérationnels en temps réel. Glissez-déposez pour changer le statut.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                showFilters || hasFilters
                  ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Filter size={16} />
              Filtres
              {hasFilters && <span className="h-2 w-2 rounded-full bg-cyan-500" />}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
            >
              <Plus size={18} /> Nouvelle tâche
            </button>
          </div>
        </header>

        {showFilters && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Filtrer les tâches</p>
              {hasFilters && (
                <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-500">
                  <X size={12} /> Tout effacer
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <User size={12} /> Assigné à
                </label>
                <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400/30 focus:bg-white transition-all">
                  <option value="">Tous</option>
                  {assignees.map((assignee) => <option key={assignee.id} value={assignee.id}>{assignee.full_name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Briefcase size={12} /> Projet
                </label>
                <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400/30 focus:bg-white transition-all">
                  <option value="">Tous</option>
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <AlertTriangle size={12} /> Priorité
                </label>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400/30 focus:bg-white transition-all">
                  <option value="">Toutes</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">Haute</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="LOW">Basse</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid min-h-[60vh] grid-cols-1 gap-6 lg:grid-cols-3">
          {(['TODO', 'DOING', 'DONE'] as const).map((status) => {
            const config = STATUS_CONFIG[status];
            const columnTasks = getTasksByStatus(status);
            const isDropping = dropTarget === status;

            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
                className={`rounded-3xl border-2 p-3 transition-all ${
                  isDropping ? `${config.border} bg-gradient-to-b ${config.tint} scale-[1.01]` : 'border-transparent'
                }`}
              >
                <div className={`mb-4 flex items-center justify-between rounded-2xl border px-4 py-3 ${config.border} bg-white shadow-sm`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">{config.label}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ${config.badge}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  {status === 'TODO' && (
                    <button onClick={() => setIsModalOpen(true)} className="rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-50 hover:text-cyan-600">
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md ${
                        draggedTask === task.id ? 'scale-95 opacity-40' : ''
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical size={14} className="text-slate-300 transition-colors group-hover:text-slate-400" />
                          <div className={`flex items-center gap-1 ${PRIORITY_CONFIG[task.priority].color}`}>
                            {PRIORITY_CONFIG[task.priority].icon}
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{PRIORITY_CONFIG[task.priority].label}</span>
                          </div>
                        </div>
                        {task.due_date && (
                          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${
                            new Date(task.due_date) < new Date() && task.status !== 'DONE'
                              ? 'border border-red-100 bg-red-50 text-red-600'
                              : 'border border-slate-100 bg-slate-50 text-slate-500'
                          }`}>
                            {new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900">{task.title}</h3>
                      {task.description && <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{task.description}</p>}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                        <div className="flex items-center gap-2">
                          {task.profiles?.full_name && (
                            <div className="flex items-center gap-1.5">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-[9px] font-bold text-cyan-700">
                                {task.profiles.full_name.charAt(0)}
                              </div>
                              <span className="text-[10px] font-medium text-slate-500">{task.profiles.full_name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.projects?.title && (
                            <span className="max-w-[100px] truncate rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {task.projects.title}
                            </span>
                          )}
                          {(task.task_comments?.length || 0) > 0 && <span className="text-[10px] font-medium text-slate-400">💬 {task.task_comments?.length}</span>}
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && !loading && (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 py-8 text-center bg-slate-50/30">
                      <p className="text-xs italic text-slate-400">Aucune tâche</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTasks} />
      </div>
    </div>
  );
}
