import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ShieldAlert, UserPlus, FileUp, Users, Lock } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (profile?.role !== 'CEO' && !profile?.is_admin) {
    redirect('/dashboard');
  }

  const { data: members } = await supabase.from('profiles').select('*');
  const { data: docs } = await supabase.from('global_documents').select('*');

  return (
    <div className="p-8 space-y-10">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-600 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Lock size={12} /> Espace Direction
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion de l'équipe</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez les accès, les membres et les documents importants.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invitations */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <UserPlus className="text-blue-600" size={22} />
            <h2 className="text-lg font-bold text-gray-900">Inviter un Membre</h2>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="email@opays.tech" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500">
                  <option value="ENGINEER">Ingénieur (Labs)</option>
                  <option value="SALES">Sales (Studio)</option>
                  <option value="CTO">CTO</option>
                  <option value="COO">COO</option>
                  <option value="INVESTOR">Investisseur</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Equity (%)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Salaire ($)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="0" />
              </div>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Générer le lien d'invitation
            </button>
          </form>
        </div>

        {/* Documents */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <FileUp className="text-purple-600" size={22} />
            <h2 className="text-lg font-bold text-gray-900">Document Confidentiel</h2>
          </div>
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre du document</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" placeholder="ex: Stratégie 2026" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Visibilité</label>
              <div className="grid grid-cols-2 gap-2">
                {['ASSOCIATE', 'EMPLOYEE', 'CEO', 'CTO', 'SALES'].map(role => (
                  <label key={role} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <input type="checkbox" className="accent-blue-600 rounded" /> {role}
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all">
              Uploader & Diffuser
            </button>
          </form>
        </div>
      </div>

      {/* Membres */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={20} /> Membres de l'organisation ({members?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members?.map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {m.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{m.full_name}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{m.role} • {m.type}</p>
                </div>
              </div>
              <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                <Lock size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
