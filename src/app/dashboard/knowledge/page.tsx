"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { BookOpen, GraduationCap, Lightbulb, Target, Plus, Trash2 } from 'lucide-react';
import NewKnowledgeModal from '@/components/modals/NewKnowledgeModal';

const IconMap: any = {
  'METHOD': <Target className="text-blue-600" size={22} />,
  'GUIDE': <GraduationCap className="text-green-600" size={22} />,
  'VISION': <Lightbulb className="text-yellow-600" size={22} />,
  'TECH': <BookOpen className="text-purple-600" size={22} />,
};

export default function KnowledgePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setProfile(profileData);
    }

    const { data } = await supabase
      .from('knowledge_articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteArticle = async (id: string) => {
    if (confirm("Supprimer ce guide ?")) {
      const { error } = await supabase.from('knowledge_articles').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const isAdmin = ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '');

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Guide & Savoir-faire</h1>
          <p className="text-gray-500 mt-1 text-sm">Le manuel pratique d'OPAYS TECH pour réussir vos missions.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} /> Nouveau Guide
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles?.map((article) => (
          <div key={article.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all group relative">
            {isAdmin && (
              <button 
                onClick={() => deleteArticle(article.id)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {IconMap[article.category] || <BookOpen size={22} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-900 pr-8">{article.title}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500 rounded-md shrink-0">
                    {article.category}
                  </span>
                </div>
                <div className="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {article.content}
                </div>
                <button className="mt-5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-all">
                  Lire le guide complet →
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && !articles?.length && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <p className="text-gray-400 italic">Aucun guide disponible pour le moment.</p>
          </div>
        )}
      </div>

      <NewKnowledgeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
