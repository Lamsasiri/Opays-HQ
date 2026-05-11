import { createServerSupabaseClient } from '@/lib/supabase-server';
import { BookOpen, GraduationCap, Lightbulb, Target } from 'lucide-react';

const IconMap: any = {
  'METHOD': <Target className="text-blue-600" size={22} />,
  'GUIDE': <GraduationCap className="text-green-600" size={22} />,
  'VISION': <Lightbulb className="text-yellow-600" size={22} />,
  'TECH': <BookOpen className="text-purple-600" size={22} />,
};

export default async function KnowledgePage() {
  const supabase = await createServerSupabaseClient();
  const { data: articles } = await supabase
    .from('knowledge_articles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Les Ficelles du Métier</h1>
        <p className="text-gray-500 mt-1 text-sm">Le savoir-faire d'OPAYS TECH, accessible en un clic.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles?.map((article) => (
          <div key={article.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {IconMap[article.category] || <BookOpen size={22} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-900">{article.title}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
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

        {!articles?.length && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <p className="text-gray-400 italic">Aucun guide disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
