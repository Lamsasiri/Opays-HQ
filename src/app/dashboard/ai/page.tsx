"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronDown,
  Cpu,
  Database,
  Loader2,
  Send,
  Shield,
  Sparkles,
  Terminal,
  User,
  Wand2,
  Zap,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useProfile } from '@/lib/ProfileProvider';

const AVAILABLE_MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', icon: <Zap size={14} /> },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: <Sparkles size={14} /> },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: <Cpu size={14} /> },
  { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro', provider: 'Google', icon: <Database size={14} /> },
];

const SUGGESTED_SKILLS = [
  { id: 'task', label: 'Créer une tâche', icon: <CheckCircle2 size={14} className="text-emerald-600" /> },
  { id: 'audit', label: 'Flux d\'activité', icon: <Zap size={14} className="text-amber-600" /> },
  { id: 'financial', label: 'Santé financière', icon: <Database size={14} className="text-sky-600" /> },
  { id: 'knowledge', label: 'Base de savoir', icon: <Terminal size={14} className="text-violet-600" /> },
  { id: 'linkedin', label: 'Post LinkedIn', icon: <Share2 size={14} className="text-cyan-600" /> },
];

export default function AICommandCenter() {
  const { profile } = useProfile();
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userProfile: profile,
      modelId: selectedModel.id,
    },
    initialMessages: [
      {
        id: 'system-init',
        role: 'assistant',
        content: `Bienvenue dans le Command Center, **${profile?.full_name || 'associ\u00e9'}**. Je suis Opays Help Ai OS, pr\u00eat \u00e0 piloter les op\u00e9rations avec **${selectedModel.name}**. Posez une question ou utilisez un skill ci-dessous.`,
      },
    ],
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSkillClick = (skill: string) => {
    if (skill === 'task') setInput('Crée une tâche pour...');
    if (skill === 'linkedin') setInput('Rédige un post LinkedIn sur...');
    if (skill === 'audit') setInput("Quelles sont les dernières activités importantes dans l'entreprise ?");
    if (skill === 'financial') setInput('Fais-moi un rapport sur la santé financière actuelle.');
    if (skill === 'knowledge') setInput('Cherche dans la base de connaissance comment nous gérons...');
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">Opays Help Ai OS</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {selectedModel.icon}
              <span>{selectedModel.name}</span>
              <ChevronDown size={14} className={`text-slate-400 transition ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            {modelOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selectedModel.id === model.id
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {model.icon}
                    <div>
                      <p className="font-semibold">{model.name}</p>
                      <p className="text-[10px] text-slate-500">{model.provider}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">Online</span>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Shield size={14} className="text-cyan-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">RBAC</span>
          </div>
        </div>
      </div>

      {/* Skills bar */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 px-6 py-2">
        <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Skills</span>
        {SUGGESTED_SKILLS.map((skill) => (
          <button
            key={skill.id}
            onClick={() => handleSkillClick(skill.id)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 shadow-sm"
          >
            {skill.icon}
            {skill.label}
          </button>
        ))}
      </div>

      {/* Chat — centered, full width */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 md:px-6">
        <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto py-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[780px] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md ${
                    m.role === 'user'
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`rounded-[1.5rem] px-5 py-4 text-sm leading-7 shadow-sm ${
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-cyan-600 text-white'
                      : 'rounded-tl-sm border border-slate-200 bg-white text-slate-800'
                  }`}>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="flex gap-1.5 rounded-[1.5rem] rounded-tl-sm border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 pt-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-lg focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-50/50 transition-all">
            <Wand2 size={18} className="text-slate-400" />
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={`Posez une question \u00e0 Opays Help Ai (${selectedModel.name})...`}
              className="flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Envoyer <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
