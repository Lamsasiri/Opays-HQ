"use client";

import React, { useEffect, useState, useRef } from 'react';
import { X, Download, FileText, BookOpen, Sparkles, Copy, Check } from 'lucide-react';

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
      <ul key={`${keyPrefix}-list-${nodes.length}`} className="space-y-2 print:space-y-1">
        {listItems.map((item, index) => (
          <li key={`${keyPrefix}-item-${index}`} className="flex gap-3 text-slate-200 print:text-black print:text-sm">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 print:bg-black" />
            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
      nodes.push(<div key={`space-${index}`} className="h-2 print:h-1" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(`h1-${index}`);
      nodes.push(<h2 key={`h1-${index}`} className="text-xl font-semibold tracking-tight text-white print:text-black print:text-lg print:mt-4">{trimmed.replace(/^#\s+/, '')}</h2>);
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`h2-${index}`);
      nodes.push(<h3 key={`h2-${index}`} className="text-base font-semibold uppercase tracking-[0.22em] text-cyan-300 print:text-black print:text-sm print:mt-3">{trimmed.replace(/^##\s+/, '')}</h3>);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`h3-${index}`);
      nodes.push(<h4 key={`h3-${index}`} className="text-sm font-semibold text-slate-100 print:text-black">{trimmed.replace(/^###\s+/, '')}</h4>);
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
    const htmlContent = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    nodes.push(<p key={`p-${index}`} className="leading-relaxed text-slate-200 print:text-black print:text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} />);
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
  const printRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${title} — OPAYS TECH</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; padding: 40px 48px; line-height: 1.7; font-size: 13px; }
          .header { border-bottom: 2px solid #0ea5e9; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
          .header .meta { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.06em; margin-right: 8px; }
          h2 { font-size: 16px; font-weight: 700; margin-top: 24px; margin-bottom: 8px; color: #0f172a; }
          h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 20px; margin-bottom: 6px; color: #0369a1; }
          h4 { font-size: 13px; font-weight: 600; margin-top: 12px; margin-bottom: 4px; }
          p { margin-bottom: 8px; }
          ul { margin: 8px 0 12px 0; padding-left: 0; list-style: none; }
          li { display: flex; gap: 8px; margin-bottom: 6px; align-items: flex-start; }
          li::before { content: '•'; color: #0ea5e9; font-weight: bold; flex-shrink: 0; margin-top: 0; }
          strong { font-weight: 600; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print { body { padding: 24px 32px; } }
        </style>
      </head>
      <body>
        <div class="header">
          ${badge ? `<span class="badge">${badge}</span>` : ''}
          ${sourceLabel ? `<span class="badge" style="background:#f1f5f9;color:#475569">${sourceLabel}</span>` : ''}
          <h1>${title}</h1>
          ${subtitle ? `<p class="meta">${subtitle}</p>` : ''}
        </div>
        <div class="content">
          ${(content || '').split('\n').map(line => {
            const t = line.trim();
            if (!t) return '<br/>';
            if (t.startsWith('# ')) return `<h2>${t.replace(/^#\s+/, '')}</h2>`;
            if (t.startsWith('## ')) return `<h3>${t.replace(/^##\s+/, '')}</h3>`;
            if (t.startsWith('### ')) return `<h4>${t.replace(/^###\s+/, '')}</h4>`;
            if (/^[-*]\s+/.test(t)) return `<ul><li>${t.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li></ul>`;
            if (/^\d+\.\s+/.test(t)) return `<ul><li>${t.replace(/^\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li></ul>`;
            return `<p>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
          }).join('\n')}
        </div>
        <div class="footer">
          OPAYS TECH — Document interne confidentiel — Généré le ${new Date().toLocaleDateString('fr-FR')}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 400);
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

        <div ref={printRef} className="max-h-[calc(100vh-8rem)] overflow-y-auto p-4 md:p-6">
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
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[#070b18] p-5 md:p-6">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.28em]">Lecture guidée</p>
              </div>
              <div className="space-y-4">{content ? renderMarkdown(content) : <p className="text-slate-400">Aucun contenu à afficher.</p>}</div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  <Download size={16} /> Télécharger PDF
                </button>
                {canCopy && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />} {copied ? 'Copié' : 'Copier le texte'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
