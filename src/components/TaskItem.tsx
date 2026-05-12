"use client";

import React, { useState } from 'react';
import { Calendar, ChevronRight, MessageSquare, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import NewTaskModal from './modals/NewTaskModal';

const StatusColors: any = {
  'TODO': 'bg-gray-100 text-gray-600',
  'DOING': 'bg-blue-50 text-blue-600',
  'DONE': 'bg-green-50 text-green-600',
};

const PriorityColors: any = {
  'HIGH': 'bg-red-50 text-red-600 border-red-200',
  'MEDIUM': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'LOW': 'bg-gray-50 text-gray-500 border-gray-200',
};

export default function TaskItem({ task, onUpdate }: { task: any, onUpdate: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const supabase = createClient();

  const toggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    if (!error) onUpdate();
  };

  const deleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Supprimer cette tâche ?")) {
      const { error } = await supabase.from('tasks').delete().eq('id', task.id);
      if (!error) onUpdate();
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsEditOpen(true)}
        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button 
            onClick={toggleStatus}
            className={`transition-colors ${task.status === 'DONE' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
          >
            {task.status === 'DONE' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-semibold text-sm truncate ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.title}
              </p>
              {task.priority && (
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${PriorityColors[task.priority] || PriorityColors['LOW']}`}>
                  {task.priority}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              {task.projects?.title && (
                <span className="text-xs text-gray-400">{task.projects.title}</span>
              )}
              {task.due_date && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={10} /> {new Date(task.due_date).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={deleteTask}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          <span className={`px-3 py-1 text-[10px] font-bold rounded-lg ${StatusColors[task.status]}`}>
            {task.status}
          </span>
          
          {task.profiles?.full_name && (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold" title={task.profiles.full_name}>
              {task.profiles.full_name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <NewTaskModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSuccess={onUpdate} 
        task={task} 
      />
    </>
  );
}
