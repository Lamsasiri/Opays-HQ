"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Lightbulb, ThumbsUp, MessageSquare } from 'lucide-react';
import NewIdeaModal from '@/components/modals/NewIdeaModal';

const CategoryColors: any = {
  'TECH': 'text-purple-600 bg-purple-50 border-purple-200',
  'SALES': 'text-blue-600 bg-blue-50 border-blue-200',
  'OPS': 'text-green-600 bg-green-50 border-green-200',
  'OTHER': 'text-gray-600 bg-gray-50 border-gray-200',
};

export default function IdeasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchIdeas = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ideas')
      .select('*, profiles(full_name)')
      .order('votes', { ascending: false });
    if (data) setIdeas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Boîte à Idées</h1>
          <p className="text-gray-500 mt-1 text-sm">Partagez vos visions et proposez des innovations pour OPAYS TECH.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-yellow-600 transition-all shadow-sm"
        >
          <Lightbulb size={18} /> Proposer une idée
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-widest ${CategoryColors[idea.category]}`}>
                  {idea.category}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">{idea.status}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">{idea.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">{idea.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">
                  {idea.profiles?.full_name?.charAt(0)}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{idea.profiles?.full_name?.split(' ')[0] || 'Inconnu'}</span>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                  <ThumbsUp size={14} />
                  <span className="text-xs font-bold">{idea.votes}</span>
                </button>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && !ideas.length && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white text-gray-400 italic">
            Aucune idée proposée pour le moment.
          </div>
        )}
      </div>

      <NewIdeaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchIdeas} 
      />
    </div>
  );
}
