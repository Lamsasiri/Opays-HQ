"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import TaskItem from '@/components/TaskItem';
import NewTaskModal from '@/components/modals/NewTaskModal';

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*, projects(title), profiles(full_name), task_comments(*, profiles(full_name))')
      .order('due_date', { ascending: true });
    if (data) setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const statusConfig: any = {
    'TODO': { label: 'À faire', bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600' },
    'DOING': { label: 'En cours', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-600' },
    'DONE': { label: 'Terminé', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-600' },
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mes Tâches</h1>
          <p className="text-gray-500 mt-1 text-sm">Suivez vos objectifs opérationnels en temps réel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} /> Nouvelle Tâche
        </button>
      </header>

      <div className="flex gap-3">
        {(['TODO', 'DOING', 'DONE'] as const).map((status) => (
          <div key={status} className={`${statusConfig[status].bg} border ${statusConfig[status].border} rounded-xl px-4 py-2 flex items-center gap-2`}>
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">{statusConfig[status].label}</span>
            <span className={`${statusConfig[status].badge} px-2 py-0.5 rounded-md text-xs font-bold`}>
              {tasks?.filter(t => t.status === status).length || 0}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        {!loading && !tasks.length && (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <p className="text-gray-400 italic">Aucune tâche en cours. Vous êtes à jour !</p>
          </div>
        )}
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTasks} 
      />
    </div>
  );
}
