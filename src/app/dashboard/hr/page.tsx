import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { UserCircle, FileText, Target, BarChart3, Download, Award } from 'lucide-react';

export default async function HRPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const { data: records } = await supabase
    .from('hr_records')
    .select('*')
    .eq('profile_id', user?.id)
    .order('created_at', { ascending: false });

  const isEmployee = profile?.type === 'EMPLOYEE';

  if (!isEmployee && !['CEO', 'COO', 'ADMIN'].includes(profile?.role || '')) {
    redirect('/dashboard');
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Espace Employé</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez vos documents administratifs et vos fiches de paie.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Target size={20} />
            <span className="text-sm font-medium">Performance Actuelle</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-gray-900">{records?.[0]?.performance_score || 0}%</h3>
            <span className="text-gray-400 text-sm">Score global</span>
          </div>
          <div className="mt-6 w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${records?.[0]?.performance_score || 0}%` }}
            ></div>
          </div>
        </div>

        {isEmployee && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-gray-400 mb-4">
              <BarChart3 size={20} />
              <span className="text-sm font-medium">Salaire Mensuel</span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900">{(profile?.salary_amount || 0).toLocaleString()} $</h3>
            <p className="text-xs text-gray-400 mt-2">Versé le 1er du mois (Net à payer).</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Award size={20} />
            <span className="text-sm font-medium">Grade / Rôle</span>
          </div>
          <h3 className="text-2xl font-bold uppercase tracking-tight text-gray-900">{profile?.role || 'Membre'}</h3>
          <p className="text-xs text-gray-400 mt-2">Membre depuis le {new Date(profile?.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText size={20} /> Documents & Fiches de paie
        </h2>
        <div className="space-y-3">
          {records?.filter(r => r.document_url).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg group-hover:text-blue-600 transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Fiche de paie - {new Date(record.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-400">{record.review_notes || 'Document administratif'}</p>
                </div>
              </div>
              <button className="p-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg transition-colors">
                <Download size={18} />
              </button>
            </div>
          ))}

          {!records?.filter(r => r.document_url).length && (
            <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 italic text-sm">Aucun document administratif disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
