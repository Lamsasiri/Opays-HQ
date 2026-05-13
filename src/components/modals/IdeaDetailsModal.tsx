"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { MessageSquare, ArrowRight, ThumbsUp, Send, Loader2, User } from 'lucide-react';

const CategoryColors: any = {
  'TECH': 'text-cyan-700 bg-cyan-50 border-cyan-100',
  'SALES': 'text-blue-700 bg-blue-50 border-blue-100',
  'OPS': 'text-emerald-700 bg-emerald-50 border-emerald-100',
  'OTHER': 'text-slate-500 bg-slate-50 border-slate-100',
};

interface IdeaDetailsModalProps {
  idea: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function IdeaDetailsModal({ idea, onClose, onUpdate }: IdeaDetailsModalProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('idea_comments')
      .select('*, profiles(full_name)')
      .eq('idea_id', idea.id)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [idea.id]);

  const handleVote = async () => {
    const { error } = await supabase
      .from('ideas')
      .update({ votes: (idea.votes || 0) + 1 })
      .eq('id', idea.id);
    if (!error) onUpdate();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('idea_comments')
      .insert({
        idea_id: idea.id,
        profile_id: user.id,
        content: newComment.trim()
      });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${CategoryColors[idea.category]}`}>
                  {idea.category}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{idea.status}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter leading-tight">{idea.title}</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowRight className="rotate-180" size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Description du concept</h4>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{idea.description}</p>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-100 text-xs font-black text-slate-400">
                  {idea.profiles?.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{idea.profiles?.full_name}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Auteur du signal</p>
                </div>
              </div>
              <button 
                onClick={handleVote}
                className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-all shadow-sm"
              >
                <ThumbsUp size={14} />
                <span>Voter ({idea.votes})</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3 text-slate-900">
                <MessageSquare size={18} className="text-cyan-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Échanges de l'équipe ({comments.length})</h4>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-slate-300" size={32} />
                </div>
              ) : comments.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 italic font-medium">Aucun commentaire. Soyez le premier à réagir !</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 font-bold border border-slate-200 text-xs">
                      {comment.profiles?.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{comment.profiles?.full_name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-cyan-100 transition-all">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <form onSubmit={handleSubmitComment} className="flex gap-4">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter une réflexion technique ou métier..." 
              className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium shadow-sm"
              disabled={submitting}
            />
            <button 
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Publier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
