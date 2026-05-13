"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  Filter,
  X,
  Sparkles,
  ArrowRight,
  Receipt,
  Clock,
  TrendingUp,
} from 'lucide-react';
import NewContractModal from '@/components/modals/NewContractModal';
import NewInvoiceModal from '@/components/modals/NewInvoiceModal';
import Link from 'next/link';
import { useProfile } from '@/lib/ProfileProvider';

const StatusColors: any = {
  PENDING: 'text-amber-600 bg-amber-50 border-amber-100',
  PARTIAL: 'text-sky-600 bg-sky-50 border-sky-100',
  PAID: 'text-emerald-600 bg-emerald-50 border-emerald-100',
};

const StatusLabels: any = {
  PENDING: 'En attente',
  PARTIAL: 'Partiel',
  PAID: 'Payé',
};

export default function ContractsPage() {
  const searchParams = useSearchParams();
  const projectIdFilter = searchParams.get('project_id');

  const [contracts, setContracts] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);
  const { isManager: isManagerFromContext } = useProfile();

  const fetchData = async () => {
    setLoading(true);

    let contractQuery = supabase.from('project_contracts').select('*, projects(id, title, status, leads(company_name))');
    if (projectIdFilter) contractQuery = contractQuery.eq('project_id', projectIdFilter);
    const { data: contractsData } = await contractQuery.order('signed_at', { ascending: false });
    if (contractsData) setContracts(contractsData);

    let billingQuery = supabase.from('project_billing').select('*, projects(id, title, leads(company_name))');
    if (projectIdFilter) billingQuery = billingQuery.eq('project_id', projectIdFilter);
    const { data: billingData } = await billingQuery.order('due_date', { ascending: true });
    if (billingData) setBilling(billingData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectIdFilter]);

  const deleteInvoice = async (id: string) => {
    if (confirm('Supprimer cette facture ?')) {
      const { error } = await supabase.from('project_billing').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const isManager = isManagerFromContext;
  const totalDue = billing?.reduce((acc, b) => acc + (b.amount_total || 0), 0) || 0;
  const totalPaid = billing?.reduce((acc, b) => acc + (b.amount_paid || 0), 0) || 0;
  const pendingCount = billing?.filter((b) => b.status !== 'PAID').length || 0;

  const activeProjectTitle = projectIdFilter && (contracts[0]?.projects?.title || billing[0]?.projects?.title);

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600">
              <Sparkles size={12} /> Suivi contractuel
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Contrats & facturation</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 font-medium">
                Un espace clair pour suivre les engagements signés, les paiements attendus et ce qui reste à recouvrer.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {projectIdFilter && (
              <Link href="/dashboard/contracts" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                <X size={16} /> Effacer le filtre
              </Link>
            )}
            {isManager && (
              <>
                <button onClick={() => setIsContractOpen(true)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-50">
                  <Plus size={16} /> Nouveau Contrat
                </button>
                <button onClick={() => setIsInvoiceOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700">
                  <DollarSign size={16} /> Nouvelle Facture
                </button>
              </>
            )}
          </div>
        </header>

        {projectIdFilter && activeProjectTitle && (
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4">
            <div className="flex items-center gap-3 text-cyan-700">
              <Filter size={18} />
              <p className="text-sm font-bold">
                Filtré par projet : <span className="uppercase tracking-tight text-cyan-900">{activeProjectTitle}</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Montant total dû</p>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-slate-900">{totalDue.toLocaleString()} $</h3>
              <div className="rounded-xl bg-slate-50 p-3 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900 transition-all">
                <Receipt size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Total encaissé</p>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-emerald-600">{totalPaid.toLocaleString()} $</h3>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Reste à recouvrer</p>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-amber-600">{(totalDue - totalPaid).toLocaleString()} $</h3>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900 uppercase tracking-tight">
                <FileText size={20} className="text-cyan-600" /> Documents contractuels
              </h2>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-100">{contracts.length} fichiers</span>
            </div>
            <div className="space-y-1 p-4">
              {contracts.map((contract: any) => (
                <div key={contract.id} className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition hover:bg-slate-50 hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                      <FileText size={20} />
                    </div>
                    <div>
                      <Link href={`/dashboard/projects/${contract.projects?.id}`} className="text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors uppercase tracking-tight">
                        {contract.projects?.title || 'Projet'}
                      </Link>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {contract.projects?.leads?.company_name} • v{contract.version} • {new Date(contract.signed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {contract.url && (
                    <a href={contract.url} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 transition hover:bg-white hover:text-cyan-600 hover:border-cyan-200 hover:shadow-sm">
                      <Download size={18} />
                    </a>
                  )}
                </div>
              ))}
              {!loading && !contracts.length && (
                <div className="py-20 text-center">
                  <FileText size={48} className="mx-auto text-slate-100" />
                  <p className="mt-4 text-sm font-medium italic text-slate-400">Aucun contrat trouvé.</p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900 uppercase tracking-tight">
                <DollarSign size={20} className="text-emerald-600" /> État des paiements
              </h2>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-100">{pendingCount} en attente</span>
            </div>
            <div className="space-y-1 p-4">
              {billing.map((invoice: any) => (
                <div key={invoice.id} className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition hover:bg-slate-50 hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} group-hover:shadow-sm transition-all`}>
                      {invoice.status === 'PAID' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <Link href={`/dashboard/projects/${invoice.projects?.id}`} className="text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors uppercase tracking-tight">
                        {invoice.projects?.title || 'Projet'}
                      </Link>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {invoice.projects?.leads?.company_name} • Échéance : {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-right">
                    <div>
                      <p className="text-sm font-black text-slate-900">{(invoice.amount_paid || 0).toLocaleString()} / {(invoice.amount_total || 0).toLocaleString()} $</p>
                      <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${StatusColors[invoice.status]}`}>
                        {StatusLabels[invoice.status] || invoice.status}
                      </span>
                    </div>
                    {isManager && (
                      <button onClick={() => deleteInvoice(invoice.id)} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!loading && !billing.length && (
                <div className="py-20 text-center">
                  <DollarSign size={48} className="mx-auto text-slate-100" />
                  <p className="mt-4 text-sm font-medium italic text-slate-400">Aucun suivi de paiement trouvé.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Vision Client</p>
            <p className="leading-relaxed font-medium">On suit les engagements avec sérieux, sans complexité inutile. La transparence financière est le socle de la confiance.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Vision Équipe</p>
            <p className="leading-relaxed font-medium">Chaque projet a ses documents, ses échéances et ses paiements visibles en un coup d'œil pour éviter tout goulot d'étranglement.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Règle d'or</p>
            <p className="leading-relaxed font-medium">Si un suivi n'est pas clair, il doit être rendu lisible avant de passer à l'exécution technique. Pas de contrat, pas de projet.</p>
          </div>
        </div>

        <NewContractModal isOpen={isContractOpen} onClose={() => setIsContractOpen(false)} onSuccess={fetchData} />
        <NewInvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} onSuccess={fetchData} />
      </div>
    </div>
  );
}
