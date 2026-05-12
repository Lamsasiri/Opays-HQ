import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare,
  Users,
  Zap,
  Layout,
  Download
} from 'lucide-react';
import Link from 'next/link';
import TaskItem from '@/components/TaskItem';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      leads (
        company_name,
        contact_name,
        email
      ),
      project_contracts (
        id,
        version,
        url,
        signed_at
      ),
      project_billing (
        id,
        amount_total,
        amount_paid,
        status,
        due_date
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (!project) notFound();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, profiles(full_name)')
    .eq('project_id', id)
    .order('due_date', { ascending: true });

  const totalBilling = project.project_billing?.reduce((acc: number, b: any) => acc + (b.amount_total || 0), 0) || 0;
  const totalPaid = project.project_billing?.reduce((acc: number, b: any) => acc + (b.amount_paid || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {project.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">{project.leads?.company_name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/dashboard/contracts?project_id=${project.id}`}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Settings size={16} /> Configurer
          </Link>
          <Link 
            href="/dashboard/workspace"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            <Zap size={16} /> Déployer
          </Link>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Budget Total</p>
              <h4 className="text-xl font-bold text-gray-900">{totalBilling.toLocaleString()} $</h4>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payé</p>
              <h4 className="text-xl font-bold text-green-600">{totalPaid.toLocaleString()} $</h4>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tâches</p>
              <h4 className="text-xl font-bold text-blue-600">{tasks?.filter(t => t.status !== 'DONE').length || 0} / {tasks?.length || 0}</h4>
            </div>
          </div>

          {/* Project Tasks */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" /> Tâches du Projet
              </h2>
              <button className="text-xs text-blue-600 font-bold hover:underline">Ajouter</button>
            </div>
            <div className="p-2 space-y-2">
              {tasks && tasks.length > 0 ? tasks.map(task => (
                <TaskItem key={task.id} task={task} onUpdate={() => {}} />
              )) : (
                <p className="text-center py-10 text-gray-400 italic text-sm">Aucune tâche assignée à ce projet.</p>
              )}
            </div>
          </div>

          {/* Activity/Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-purple-600" /> Discussion & Historique
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0" />
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 italic">
                  Pas d'activité récente enregistrée.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <textarea 
                  className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all"
                  placeholder="Laisser un commentaire ou une note interne..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Client & Contracts Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Client & Contact</h3>
              <p className="text-sm font-bold text-gray-900">{project.leads?.company_name}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <Users size={12} /> {project.leads?.contact_name || 'Contact inconnu'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Documents & Contrats</h3>
                <Link href={`/dashboard/contracts?project_id=${project.id}`} className="text-[10px] text-blue-600 font-bold hover:underline">Gérer</Link>
              </div>
              <div className="space-y-2">
                {project.project_contracts?.length > 0 ? project.project_contracts.map((c: any) => (
                  <a key={c.id} href={c.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-xs font-semibold text-gray-700 group transition-all border border-transparent hover:border-blue-100">
                    <span className="flex items-center gap-2"><FileText size={14} className="text-blue-500" /> Contrat v{c.version}</span>
                    <Download size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </a>
                )) : (
                  <p className="text-[11px] text-gray-400 italic">Aucun contrat signé.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">État de Facturation</h3>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-500">Total Encaissé</span>
                  <span className="font-bold text-gray-900">{totalPaid.toLocaleString()} $</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (totalPaid / (totalBilling || 1)) * 100)}%` }}
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-2 font-medium">Pipeline : {totalBilling.toLocaleString()} $</p>
              </div>
            </div>
          </div>

          {/* Project Meta */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Informations Projet</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Échéance</span>
                <span className="font-bold text-gray-900">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'Non définie'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Branche</span>
                <span className="font-bold text-gray-900">{project.branch}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Progression</span>
                <span className="font-bold text-blue-600">65%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
