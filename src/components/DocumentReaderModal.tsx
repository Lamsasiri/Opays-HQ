"use client";

import React, { useEffect, useState } from 'react';
import { X, Download, FileText, BookOpen, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';

type DocumentReaderModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content?: string;
  pdfUrl?: string | null;
  badge?: string;
  sourceLabel?: string;
  copyText?: string;
};

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={`${keyPrefix}-list-${nodes.length}`} className="space-y-2">
        {listItems.map((item, index) => (
          <li key={`${keyPrefix}-item-${index}`} className="flex gap-3 text-slate-200">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`blank-${index}`);
      nodes.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(`h1-${index}`);
      nodes.push(<h2 key={`h1-${index}`} className="text-xl font-semibold tracking-tight text-white">{trimmed.replace(/^#\s+/, '')}</h2>);
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`h2-${index}`);
      nodes.push(<h3 key={`h2-${index}`} className="text-base font-semibold uppercase tracking-[0.22em] text-cyan-300">{trimmed.replace(/^##\s+/, '')}</h3>);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`h3-${index}`);
      nodes.push(<h4 key={`h3-${index}`} className="text-sm font-semibold text-slate-100">{trimmed.replace(/^###\s+/, '')}</h4>);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      return;
    }

    flushList(`p-${index}`);
    nodes.push(<p key={`p-${index}`} className="leading-relaxed text-slate-200">{trimmed}</p>);
  });

  flushList('end');
  return nodes;
}

export default function DocumentReaderModal({
  open,
  onClose,
  title,
  subtitle,
  content,
  pdfUrl,
  badge,
  sourceLabel,
  copyText,
}: DocumentReaderModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isPdf = Boolean(pdfUrl && pdfUrl !== '#');
  const canCopy = Boolean(copyText || content);

  const handleCopy = async () => {
    const text = copyText || content || '';
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl" onMouseDown={onClose}>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-black/60"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/10 p-5 md:p-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                {isPdf ? <FileText size={18} /> : <BookOpen size={18} />}
              </div>
              {badge && (
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-200">
                  {badge}
                </span>
              )}
              {sourceLabel && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  {sourceLabel}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
            {subtitle && <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-4 md:p-6">
          {isPdf ? (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-black/30">
                <iframe
                  title={title}
                  src={pdfUrl as string}
                  className="h-[72vh] w-full rounded-[1.25rem] bg-white"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={pdfUrl as string}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  <Download size={16} /> Ouvrir le PDF
                </a>
                {canCopy && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />} {copied ? 'Copié' : 'Copier le texte'}
                  </button>
                )}
                <span className="text-xs text-slate-500">Le PDF est privilégié pour les documents à lire.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[#070b18] p-5 md:p-6">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.28em]">Lecture guidée</p>
              </div>
              <div className="space-y-4">{content ? renderMarkdown(content) : <p className="text-slate-400">Aucun contenu à afficher.</p>}</div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {canCopy && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />} {copied ? 'Copié' : 'Copier le texte'}
                  </button>
                )}
                <p className="text-xs text-slate-500">Astuce: pour un document long, exporte-le en PDF afin de garder une lecture plus stable dans la modale.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
