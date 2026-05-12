"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  CheckCircle2, 
  PlusCircle, 
  DollarSign, 
  UserPlus, 
  MessageSquare,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchActivities = async () => {
    setLoading(true);
    
    // Aggregating recent events from different tables with real IDs
    const { data: leads } = await supabase.from('leads').select('id, company_name, created_at, status').order('created_at', { ascending: false }).limit(3);
    const { data: tasks } = await supabase.from('tasks').select('id, project_id, title, status, updated_at').order('updated_at', { ascending: false }).limit(3);
    const { data: projects } = await supabase.from('projects').select('id, title, created_at').order('created_at', { ascending: false }).limit(2);
    const { data: billing } = await supabase.from('project_billing').select('id, project_id, amount_paid, projects(id, title), updated_at').order('updated_at', { ascending: false }).limit(2);

    const combined = [
      ...(leads || []).map(l => ({ 
        id: l.id,
        type: 'LEAD', 
        href: '/dashboard/leads',
        title: `Nouveau lead : ${l.company_name}`, 
        time: l.created_at,
        icon: <UserPlus size={14} className="text-blue-500" />
      })),
      ...(tasks || []).map(t => ({ 
        id: t.id,
        type: 'TASK', 
        href: t.project_id ? `/dashboard/projects/${t.project_id}` : '/dashboard/tasks',
        title: t.status === 'DONE' ? `Tâche terminée : ${t.title}` : `Tâche modifiée : ${t.title}`, 
        time: t.updated_at,
        icon: t.status === 'DONE' ? <CheckCircle2 size={14} className="text-green-500" /> : <Clock size={14} className="text-gray-400" />
      })),
      ...(projects || []).map(p => ({ 
        id: p.id,
        type: 'PROJECT', 
        href: `/dashboard/projects/${p.id}`,
        title: `Nouveau projet lancé : ${p.title}`, 
        time: p.created_at,
        icon: <PlusCircle size={14} className="text-purple-500" />
      })),
      ...(billing || []).map(b => {
        const p = Array.isArray(b.projects) ? b.projects[0] : b.projects;
        return { 
          id: b.id,
          type: 'BILLING', 
          href: p?.id ? `/dashboard/projects/${p.id}` : '/dashboard/contracts',
          title: `Paiement reçu : ${b.amount_paid}$ (${p?.title || 'Projet'})`, 
          time: b.updated_at,
          icon: <DollarSign size={14} className="text-green-600" />
        };
      })
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

    setActivities(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <MessageSquare size={14} /> Flux d'Activité Global
      </h3>
      
      <div className="space-y-6">
        {activities.map((act, i) => (
          <Link 
            key={i} 
            href={act.href}
            className="flex gap-4 relative group"
          >
            {i !== activities.length - 1 && (
              <div className="absolute left-[7px] top-[24px] bottom-[-24px] w-[1px] bg-gray-100" />
            )}
            <div className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center mt-1 z-10 group-hover:bg-blue-50 transition-colors">
              {act.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{act.title}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                {new Date(act.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {new Date(act.time).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Link>
        ))}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-4 h-4 bg-gray-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-50 rounded w-3/4" />
                  <div className="h-2 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !activities.length && (
          <p className="text-xs text-gray-400 italic text-center py-4">Aucune activité récente.</p>
        )}
      </div>
    </div>
  );
}
