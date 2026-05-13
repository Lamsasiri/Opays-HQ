"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Briefcase, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NewTaskModal from '@/components/modals/NewTaskModal';

type CalendarEvent = {
  id: string;
  title: string;
  due_date: string;
  type: 'task' | 'project';
  status: string;
};

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function CalendarPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialDate, setInitialDate] = useState('');
  const supabase = useMemo(() => createClient(), []);

  const fetchEvents = async () => {
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${getDaysInMonth(currentYear, currentMonth)}`;

    const [{ data: tasks }, { data: projects }] = await Promise.all([
      supabase.from('tasks').select('id, title, due_date, status').gte('due_date', startDate).lte('due_date', endDate),
      supabase.from('projects').select('id, title, due_date, status').gte('due_date', startDate).lte('due_date', endDate),
    ]);

    const mapped: CalendarEvent[] = [
      ...(tasks || []).map((t: any) => ({ ...t, type: 'task' as const })),
      ...(projects || []).map((p: any) => ({ ...p, type: 'project' as const })),
    ];
    setEvents(mapped);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear, supabase]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = now.getDate();
  const isCurrentMonth = now.getMonth() === currentMonth && now.getFullYear() === currentYear;

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.due_date === dateStr);
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleDayClick = (day: number) => {
    if (selectedDay === day) {
      // Si on clique sur le jour déjà sélectionné, on propose d'ajouter une tâche
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setInitialDate(dateStr);
      setIsModalOpen(true);
    } else {
      setSelectedDay(day);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setSelectedDay(null);
  };

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">
              <CalendarIcon size={12} /> Planning Central
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Calendrier d'équipe</h1>
            <p className="max-w-xl text-sm text-slate-500 font-medium">Visualisez les échéances, planifiez les descentes et gérez les tâches critiques.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button onClick={prevMonth} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900">
                <ChevronLeft size={20} />
              </button>
              <span className="min-w-[140px] text-center text-sm font-bold text-slate-900 uppercase tracking-tight">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button onClick={nextMonth} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900">
                <ChevronRight size={20} />
              </button>
            </div>
            <button 
              onClick={() => {
                const day = selectedDay || today;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                setInitialDate(dateStr);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
            >
              <Plus size={16} /> Événement
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
          {/* Calendar grid */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 grid grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = isCurrentMonth && day === today;
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`group relative flex aspect-square flex-col items-center justify-center rounded-[1.5rem] border text-sm font-bold transition-all ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-600 text-white shadow-xl shadow-cyan-600/20 scale-[1.02] z-10'
                        : isToday
                          ? 'border-cyan-100 bg-cyan-50 text-cyan-600'
                          : 'border-slate-50 text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:scale-[1.02]'
                    }`}
                  >
                    <span className="relative z-10">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                              isSelected 
                                ? 'bg-white/80' 
                                : e.type === 'task' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
                            }`} 
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-slate-300'}`} />
                        )}
                      </div>
                    )}
                    {/* Hover indicator for fast add */}
                    {!isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 rounded-full bg-cyan-100 p-1 text-cyan-600">
                          <Plus size={10} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-6 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" /> Tâches
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.2)]" /> Projets
              </div>
              <div className="ml-auto text-[10px] font-medium text-slate-400 italic">
                Cliquez deux fois sur un jour pour ajouter un événement.
              </div>
            </div>
          </div>

          {/* Day detail */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                    {selectedDay
                      ? `${selectedDay} ${MONTHS[currentMonth]}`
                      : 'Sélectionnez un jour'}
                  </h3>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                    {selectedDayEvents.length} échéance{selectedDayEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-slate-400">
                  <CalendarIcon size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {selectedDayEvents.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-200">
                        <Sparkles size={24} />
                      </div>
                      <p className="text-sm italic text-slate-400 font-medium">Libre de toute échéance.</p>
                      <button 
                        onClick={() => {
                          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay || today).padStart(2, '0')}`;
                          setInitialDate(dateStr);
                          setIsModalOpen(true);
                        }}
                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-cyan-600 hover:underline"
                      >
                        Planifier quelque chose
                      </button>
                    </motion.div>
                  ) : (
                    selectedDayEvents.map((event) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-900/5"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                          event.type === 'task' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-violet-50 text-violet-600 border border-violet-100'
                        } group-hover:scale-110`}>
                          {event.type === 'task' ? <CheckCircle2 size={18} /> : <Briefcase size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900 uppercase tracking-tight leading-tight">{event.title}</p>
                          <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">{event.status}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-cyan-100 bg-cyan-50/50 p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-600 p-2 text-white shadow-lg shadow-cyan-600/20">
                  <Sparkles size={16} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Vision Opays</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cyan-900/70 font-medium italic">
                "Le temps est la ressource la plus critique de notre commando. Un calendrier clair est la moitié de la victoire."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEvents}
        initialDate={initialDate}
      />
    </div>
  );
}
