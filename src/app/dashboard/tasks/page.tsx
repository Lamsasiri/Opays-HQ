"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useProfile } from '@/lib/ProfileProvider';
import { 
  Plus, Filter, X, Calendar, User, Briefcase, GripVertical,
  Clock, AlertTriangle, ArrowUp, ChevronDown
} from 'lucide-react';
import TaskItem from '@/components/TaskItem';
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

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; border: string; badge: string; dropBg: string }> = {
  'TODO': { label: 'À faire', bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600', dropBg: 'bg-gray-100/50' },
  'DOING': { label: 'En cours', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-600', dropBg: 'bg-blue-100/50' },
  'DONE': { label: 'Terminé', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-600', dropBg: 'bg-green-100/50' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: React.ReactNode; color: string }> = {
  'LOW': { label: 'Basse', icon: <ChevronDown size={12} />, color: 'text-gray-400' },
  'MEDIUM': { label: 'Moyenne', icon: <Clock size={12} />, color: 'text-yellow-500' },
  'HIGH': { label: 'Haute', icon: <ArrowUp size={12} />, color: 'text-orange-500' },
  'URGENT': { label: 'Urgent', icon: <AlertTriangle size={12} />, color: 'text-red-500' },
};

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  
  // Filters
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter options
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
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');
    if (profilesData) setAssignees(profilesData);

    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, title')
      .order('title');
    if (projectsData) setProjects(projectsData);
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
    fetchFilterOptions();
  }, [fetchTasks, fetchFilterOptions]);

  // Apply filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filterAssignee && t.assigned_to !== filterAssignee) return false;
      if (filterProject && t.project_id !== filterProject) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterAssignee, filterProject, filterPriority]);

  const hasFilters = filterAssignee || filterProject || filterPriority;

  const clearFilters = () => {
    setFilterAssignee('');
    setFilterProject('');
    setFilterPriority('');
  };

  // Drag & Drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDropTarget(status);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDropTarget(null);
    if (!draggedTask) return;

    const task = tasks.find(t => t.id === draggedTask);
    if (!task || task.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === draggedTask ? { ...t, status: newStatus } : t));
    setDraggedTask(null);

    // Persist to database
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', draggedTask);

    if (error) {
      // Revert on error
      setTasks(prev => prev.map(t => t.id === draggedTask ? { ...t, status: task.status } : t));
    }
  };

  const getTasksByStatus = (status: TaskStatus) => 
    filteredTasks.filter(t => t.status === status);

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mes Tâches</h1>
          <p className="text-gray-500 mt-1 text-sm">Suivez vos objectifs opérationnels en temps réel. Glissez-déposez pour changer le statut.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all ${
              showFilters || hasFilters
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filtres
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} /> Nouvelle Tâche
          </button>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filtrer les tâches</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                <X size={12} /> Tout effacer
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <User size={12} /> Assigné à
              </label>
              <select 
                value={filterAssignee} 
                onChange={e => setFilterAssignee(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Tous</option>
                {assignees.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Briefcase size={12} /> Projet
              </label>
              <select 
                value={filterProject} 
                onChange={e => setFilterProject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Tous</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle size={12} /> Priorité
              </label>
              <select 
                value={filterPriority} 
                onChange={e => setFilterPriority(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Toutes</option>
                <option value="URGENT">🔴 Urgent</option>
                <option value="HIGH">🟠 Haute</option>
                <option value="MEDIUM">🟡 Moyenne</option>
                <option value="LOW">⚪ Basse</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[60vh]">
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
              className={`rounded-2xl border-2 transition-all ${
                isDropping 
                  ? `${config.dropBg} border-dashed ${config.border} scale-[1.01]`
                  : 'border-transparent'
              }`}
            >
              {/* Column Header */}
              <div className={`${config.bg} border ${config.border} rounded-xl px-4 py-3 mb-4 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">{config.label}</span>
                  <span className={`${config.badge} px-2 py-0.5 rounded-md text-xs font-bold`}>
                    {columnTasks.length}
                  </span>
                </div>
                {status === 'TODO' && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* Task Cards */}
              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
                      draggedTask === task.id ? 'opacity-40 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
                        <div className={`flex items-center gap-1 ${PRIORITY_CONFIG[task.priority].color}`}>
                          {PRIORITY_CONFIG[task.priority].icon}
                          <span className="text-[9px] font-bold uppercase tracking-widest">
                            {PRIORITY_CONFIG[task.priority].label}
                          </span>
                        </div>
                      </div>
                      {task.due_date && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                          new Date(task.due_date) < new Date() && task.status !== 'DONE'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-gray-50 text-gray-400 border border-gray-100'
                        }`}>
                          {new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{task.title}</h3>

                    {task.description && (
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        {task.profiles?.full_name && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">
                              {task.profiles.full_name.charAt(0)}
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">{task.profiles.full_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.projects?.title && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded border border-gray-100 uppercase tracking-wider truncate max-w-[100px]">
                            {task.projects.title}
                          </span>
                        )}
                        {(task.task_comments?.length || 0) > 0 && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            💬 {task.task_comments?.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && !loading && (
                  <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-300 italic">Aucune tâche</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTasks} 
      />
    </div>
  );
}
