"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Copy, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  User, 
  Award, 
  Target, 
  TrendingUp,
  Download,
  ArrowLeft
} from 'lucide-react';
import DocumentReaderModal from '@/components/DocumentReaderModal';
import { getJobDescription, jobDescriptionToMarkdown, jobDescriptions } from '@/lib/jobDescriptions';

export default function JobDescriptionsPage() {
  const [activeSlug, setActiveSlug] = useState(jobDescriptions[0].slug);
  const [readerOpen, setReaderOpen] = useState(false);
  const job = useMemo(() => getJobDescription(activeSlug) || jobDescriptions[0], [activeSlug]);

  const markdown = jobDescriptionToMarkdown(job);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    alert('Markdown copié !');
  };

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            <Sparkles size={12} /> Talent & Organization
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Fiches de poste Opays Tech</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-500 font-medium">
            Découvrez les responsabilités, les attentes et les KPIs de chaque rôle au sein de la structure commando. Chaque fiche suit la source de vérité de <code>docs/TEAM.md</code>.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-3">
            {jobDescriptions.map((item) => {
              const active = item.slug === activeSlug;
              return (
                <button
                  key={item.slug}
                  onClick={() => setActiveSlug(item.slug)}
                  className={`w-full rounded-[2rem] border p-6 text-left transition-all ${
                    active
                      ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-600/5 ring-1 ring-indigo-600/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl p-3 border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-slate-400">{item.reference}</p>
                      <h2 className={`mt-1 text-base font-bold uppercase tracking-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{item.title}</h2>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{item.holder} • {item.role}</p>
                      <p className={`mt-4 text-sm leading-relaxed font-medium line-clamp-2 ${active ? 'text-slate-600' : 'text-slate-400'}`}>{item.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                    <BookOpen size={12} /> Lecture structurée
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">{job.title}</h2>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">{job.summary}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Copy size={16} /> Markdown
                  </button>
                  <button
                    onClick={() => setReaderOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-black"
                  >
                    <Download size={16} /> Lire & PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm space-y-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={16} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Titulaire</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">{job.holder}</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award size={16} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Rôle HQ</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">{job.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Présentation du poste</h3>
                <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-8">
                  <p className="text-sm leading-8 text-slate-600 font-medium text-justify">{job.presentation}</p>
                </div>
              </div>

              <div className="space-y-8">
                {job.sections.map((section) => (
                  <div key={section.title} className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">{section.title}</h3>
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-2">
                      <ul className="divide-y divide-slate-50">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-4 p-5 text-sm leading-relaxed text-slate-600 font-medium hover:bg-slate-50 transition-colors rounded-xl">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Indicateurs (KPIs)</h3>
                  <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/30 p-8 space-y-4">
                    {job.kpis.map((kpi) => (
                      <div key={kpi} className="flex gap-4 text-sm font-bold text-emerald-800 leading-relaxed">
                        <Target size={18} className="shrink-0 text-emerald-600" />
                        <span>{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Perspectives d'Évolution</h3>
                  <div className="rounded-[2rem] border border-amber-100 bg-amber-50/30 p-8 space-y-4">
                    {job.evolution.map((item) => (
                      <div key={item} className="flex gap-4 text-sm font-bold text-amber-800 leading-relaxed">
                        <TrendingUp size={18} className="shrink-0 text-amber-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm print:hidden">
              <h3 className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 mb-6">Accès direct aux autres fiches</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {jobDescriptions.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => setActiveSlug(item.slug)}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all group"
                  >
                    <span className="uppercase tracking-tight">{item.title}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <DocumentReaderModal
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
        title={job.title}
        subtitle={job.summary}
        content={markdown}
        badge="Fiche de poste"
        sourceLabel={job.holder}
        copyText={markdown}
      />
    </div>
  );
}
