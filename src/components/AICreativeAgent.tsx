"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Sparkles, Send, Bot, User, Loader2, ImageIcon, Presentation, FileText, Share2, Copy, Check, Info } from 'lucide-react';
import { useProfile } from '@/lib/ProfileProvider';

export default function AICreativeAgent() {
  const { profile } = useProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userProfile: profile,
      role: 'CREATIVE_AGENT',
    },
    initialMessages: [
      {
        id: 'brand-init',
        role: 'assistant',
        content: `Bonjour. Je suis votre **Assistant Créatif Opays**. Je maîtrise les codes de notre marque sur le bout des doigts. 
        
Que souhaitez-vous créer aujourd'hui ? Un flyer pour une descente terrain ? Une structure de deck Canva ? Ou un texte percutant pour LinkedIn ?`,
      },
    ],
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAction = (type: string) => {
    if (type === 'flyer') setInput("Aide-moi à structurer un flyer pour un audit d'automatisation chez un nouveau prospect.");
    if (type === 'canva') setInput("Génère un plan de 10 diapositives pour une présentation Vision CEO d'Opays Tech.");
    if (type === 'post') setInput("Rédige un post LinkedIn court et expert sur la souveraineté numérique avec Opays.");
  };

  return (
    <div className="flex flex-col h-[700px] rounded-[2.5rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight uppercase">AI Creative Agent</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Brand Guardian • Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
             <Info size={12} className="text-indigo-500" /> V2.4 Stable
           </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent_40%)]"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
              m.role === 'user' 
                ? 'bg-slate-50 border-slate-200 text-slate-600' 
                : 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-600/10'
            }`}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[80%] rounded-[2rem] p-6 text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-slate-100' 
                : 'bg-white border border-slate-100 text-slate-700'
            }`}>
              <div className="prose prose-slate prose-sm max-w-none prose-p:font-medium">
                {m.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
              {m.role === 'assistant' && m.id !== 'brand-init' && (
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                  <button 
                    onClick={() => copyToClipboard(m.content)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copié' : 'Copier'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/10">
              <Loader2 className="animate-spin" size={18} />
            </div>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce delay-75" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions & Input */}
      <div className="p-8 bg-slate-50/50 border-t border-slate-100">
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => handleQuickAction('flyer')} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
            <ImageIcon size={14} className="text-indigo-500" /> Structure Flyer
          </button>
          <button onClick={() => handleQuickAction('canva')} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
            <Presentation size={14} className="text-indigo-500" /> Plan Deck Canva
          </button>
          <button onClick={() => handleQuickAction('post')} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
            <Share2 size={14} className="text-indigo-500" /> Rédaction Sociale
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <input 
            value={input}
            onChange={handleInputChange}
            placeholder="Décrivez votre besoin branding..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 pr-16 text-sm text-slate-900 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm placeholder:text-slate-400 font-medium"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-4 flex items-center justify-center gap-4">
           <div className="h-px bg-slate-200 flex-1" />
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
             Opays-Tactical v2.4 • Private Model
           </p>
           <div className="h-px bg-slate-200 flex-1" />
        </div>
      </div>
    </div>
  );
}
