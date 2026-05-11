import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Briefcase, Calendar, DollarSign, ShieldCheck, TrendingDown } from 'lucide-react';

const StatusColors: any = {
  'PLANNING': 'text-gray-600 bg-gray-50 border-gray-200',
  'IN_PROGRESS': 'text-blue-600 bg-blue-50 border-blue-200',
  'TESTING': 'text-purple-600 bg-purple-50 border-purple-200',
  'COMPLETED': 'text-green-600 bg-green-50 border-green-200',
  'MAINTENANCE': 'text-orange-600 bg-orange-50 border-orange-200',
};

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('id', user?.id)
    .single();

  const isAssociate = profile?.type === 'ASSOCIATE';

  const { data: projects } = await supabase
    .from('projects')
    .select('*, leads(company_name)')
    .order('due_date', { ascending: true });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-500 mt-1 text-sm">Suivi de la production, de la maintenance et de la facturation.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all group">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-widest ${
                        project.branch === 'STUDIO' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {project.branch}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400">Client : <span className="text-gray-600 font-medium">{project.leads?.company_name}</span></p>
                  </div>
                  <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full border uppercase tracking-widest ${StatusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-semibold rounded-lg border border-gray-200 uppercase">{tech}</span>
                  ))}
                </div>

                {/* Definition of Done */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <span>Definition of Done</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-500">P0 / P1</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.definition_of_done?.length ? project.definition_of_done.map((step: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                        <div className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          {i + 1}
                        </div>
                        {step}
                      </div>
                    )) : (
                      <p className="text-xs text-gray-400 italic">Aucune étape de validation définie.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Financier */}
              <div className="lg:w-72 space-y-4 border-l border-gray-100 pl-8">
                {isAssociate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <DollarSign size={12} /> Marge Prévisionnelle
                        </p>
                        <p className="text-xl font-bold text-green-600">{(project.gross_margin_projected || 0).toLocaleString()} $</p>
                      </div>
                      <div className="space-y-1 pt-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <TrendingDown size={12} className="text-red-500" /> Marge Réelle
                        </p>
                        <p className={`text-xl font-bold ${(project.gross_margin_real || 0) < (project.gross_margin_projected || 0) ? 'text-red-500' : 'text-green-600'}`}>
                          {(project.gross_margin_real || 0).toLocaleString()} $
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Facturation</p>
                        <p className="text-[10px] font-bold text-gray-700 uppercase">{project.billing_status || 'PENDING'}</p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Maintenance</p>
                        <p className="text-[10px] font-bold text-green-600 uppercase">{project.is_maintenance_active ? 'ACTIVE' : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center space-y-3 h-full">
                    <ShieldCheck size={28} className="text-gray-300" />
                    <p className="text-xs text-gray-400">Données financières restreintes aux Associés.</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-3">
                  <button className="w-full py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-all shadow-sm uppercase tracking-widest">
                    Ouvrir le Workspace
                  </button>
                  <button className="w-full py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest">
                    Gestion Contrats
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!projects?.length && (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 italic">Aucun projet actif. Signez un lead pour commencer !</p>
          </div>
        )}
      </div>
    </div>
  );
}
