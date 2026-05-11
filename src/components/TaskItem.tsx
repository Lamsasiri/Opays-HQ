"use client";

import React from 'react';
import { Calendar, ChevronRight, MessageSquare } from 'lucide-react';

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

export default function TaskItem({ task }: { task: any }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full ${task.status === 'DONE' ? 'bg-green-500' : task.status === 'DOING' ? 'bg-blue-500' : 'bg-gray-300'}`} />
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
            {task.task_comments?.length > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MessageSquare size={10} /> {task.task_comments.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 text-[10px] font-bold rounded-lg ${StatusColors[task.status]}`}>
          {task.status}
        </span>
        {task.profiles?.full_name && (
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold" title={task.profiles.full_name}>
            {task.profiles.full_name.charAt(0)}
          </div>
        )}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );
}
