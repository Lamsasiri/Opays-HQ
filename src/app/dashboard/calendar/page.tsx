"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
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
    <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.10),_transparent_20%),linear-gradient(180deg,_#050816_0%,_#090d19_100%)] px-6 py-8 text-slate-100 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-15" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200">
              <CalendarIcon size={12} /> Calendrier
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Calendrier d'équipe</h1>
            <p className="max-w-xl text-sm text-slate-400">Visualisez les échéances des tâches et projets de l'équipe.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10">
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[180px] text-center text-lg font-semibold text-white">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          {/* Calendar grid */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-3 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
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
                    onClick={() => setSelectedDay(day)}
                    className={`group relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                      isSelected
                        ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-200 ring-2 ring-cyan-400/20'
                        : isToday
                          ? 'border-cyan-400/20 bg-cyan-400/10 text-white'
                          : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {day}
                    {dayEvents.length > 0 && (
                      <div className="mt-0.5 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <div key={idx} className={`h-1.5 w-1.5 rounded-full ${e.type === 'task' ? 'bg-emerald-400' : 'bg-violet-400'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="h-2 w-2 rounded-full bg-emerald-400" /> Tâches
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="h-2 w-2 rounded-full bg-violet-400" /> Projets
              </div>
            </div>
          </div>

          {/* Day detail */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white">
                {selectedDay
                  ? `${selectedDay} ${MONTHS[currentMonth]}`
                  : 'Sélectionnez un jour'}
              </h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                {selectedDayEvents.length} échéance{selectedDayEvents.length !== 1 ? 's' : ''}
              </p>

              <div className="mt-4 space-y-3">
                {selectedDayEvents.length === 0 && (
                  <p className="py-8 text-center text-sm italic text-slate-500">Aucune échéance ce jour.</p>
                )}
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      event.type === 'task' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-violet-500/15 text-violet-300'
                    }`}>
                      {event.type === 'task' ? <CheckCircle2 size={16} /> : <Briefcase size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{event.title}</p>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{event.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-200" />
                <p className="text-xs font-bold text-cyan-100">Astuce</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200/80">
                Ajoutez une date d'échéance à vos tâches et projets pour les voir apparaître ici automatiquement.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
