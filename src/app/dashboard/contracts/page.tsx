"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Trash2, 
  Plus,
  Filter,
  X
} from 'lucide-react';
import NewContractModal from '@/components/modals/NewContractModal';
import NewInvoiceModal from '@/components/modals/NewInvoiceModal';
import Link from 'next/link';
import { useProfile } from '@/lib/ProfileProvider';

const StatusColors: any = {
  'PENDING': 'text-orange-600 bg-orange-50 border-orange-200',
  'PARTIAL': 'text-blue-600 bg-blue-50 border-blue-200',
  'PAID': 'text-green-600 bg-green-50 border-green-200',
};

const StatusLabels: any = {
  'PENDING': 'En attente',
  'PARTIAL': 'Partiel',
  'PAID': 'Payé',
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
  const { profile, isManager: isManagerFromContext } = useProfile();

  const fetchData = async () => {
    setLoading(true);

    let contractQuery = supabase
      .from('project_contracts')
      .select('*, projects(id, title, status, leads(company_name))');
    
    if (projectIdFilter) {
      contractQuery = contractQuery.eq('project_id', projectIdFilter);
    }

    const { data: contractsData } = await contractQuery.order('signed_at', { ascending: false });
    if (contractsData) setContracts(contractsData);

    let billingQuery = supabase
      .from('project_billing')
      .select('*, projects(id, title, leads(company_name))');
    
    if (projectIdFilter) {
      billingQuery = billingQuery.eq('project_id', projectIdFilter);
    }

    const { data: billingData } = await billingQuery.order('due_date', { ascending: true });
    if (billingData) setBilling(billingData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectIdFilter]);

  const deleteInvoice = async (id: string) => {
    if (confirm("Supprimer cette facture ?")) {
      const { error } = await supabase.from('project_billing').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const isManager = isManagerFromContext;

  const totalDue = billing?.reduce((acc, b) => acc + (b.amount_total || 0), 0) || 0;
  const totalPaid = billing?.reduce((acc, b) => acc + (b.amount_paid || 0), 0) || 0;
  const pendingCount = billing?.filter(b => b.status !== 'PAID').length || 0;

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contrats & Facturation</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestion des engagements contractuels et suivi financier.</p>
        </div>
        <div className="flex gap-3">
          {projectIdFilter && (
            <Link 
              href="/dashboard/contracts"
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <X size={16} /> Effacer Filtre
            </Link>
          )}
          {isManager && (
            <>
              <button 
                onClick={() => setIsContractOpen(true)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} className="text-blue-600" /> Contrat
              </button>
              <button 
                onClick={() => setIsInvoiceOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <DollarSign size={16} /> Facture
              </button>
            </>
          )}
        </div>
      </header>

      {projectIdFilter && contracts.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-blue-600" />
            <p className="text-sm font-medium text-blue-900">
              Filtré par projet : <span className="font-bold">{contracts[0]?.projects?.title || billing[0]?.projects?.title}</span>
            </p>
          </div>
        </div>
      )}

      {/* Indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Montant Total</p>
          <h3 className="text-2xl font-bold text-gray-900">{totalDue.toLocaleString()} $</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Encaissé</p>
          <h3 className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} $</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">À Recouvrer</p>
          <h3 className="text-2xl font-bold text-orange-600">{(totalDue - totalPaid).toLocaleString()} $</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contrats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText size={20} className="text-blue-600" /> Documents Contractuels</span>
            <span className="text-xs text-gray-400 font-normal">{contracts.length} fichiers</span>
          </h2>
          <div className="space-y-3">
            {contracts.map((contract: any) => (
              <div key={contract.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <Link href={`/dashboard/projects/${contract.projects?.id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                      {contract.projects?.title || 'Projet'}
                    </Link>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {contract.projects?.leads?.company_name} • v{contract.version} • {new Date(contract.signed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {contract.url && (
                  <a href={contract.url} target="_blank" rel="noreferrer" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                    <Download size={16} />
                  </a>
                )}
              </div>
            ))}
            {!loading && !contracts.length && (
              <div className="py-12 text-center">
                <FileText size={40} className="mx-auto text-gray-100 mb-3" />
                <p className="text-gray-400 text-sm italic">Aucun contrat trouvé.</p>
              </div>
            )}
          </div>
        </div>

        {/* Factures */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center justify-between">
            <span className="flex items-center gap-2"><DollarSign size={20} className="text-green-600" /> État des Paiements</span>
            <span className="text-xs text-gray-400 font-normal">{billing.length} factures</span>
          </h2>
          <div className="space-y-3">
            {billing.map((invoice: any) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${invoice.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {invoice.status === 'PAID' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <Link href={`/dashboard/projects/${invoice.projects?.id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                      {invoice.projects?.title || 'Projet'}
                    </Link>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {invoice.projects?.leads?.company_name} • Échéance : {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{(invoice.amount_paid || 0).toLocaleString()} / {(invoice.amount_total || 0).toLocaleString()} $</p>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border inline-block mt-1 ${StatusColors[invoice.status]}`}>
                      {StatusLabels[invoice.status] || invoice.status}
                    </span>
                  </div>
                  {isManager && (
                    <button onClick={() => deleteInvoice(invoice.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!loading && !billing.length && (
              <div className="py-12 text-center">
                <DollarSign size={40} className="mx-auto text-gray-100 mb-3" />
                <p className="text-gray-400 text-sm italic">Aucun suivi de paiement trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewContractModal isOpen={isContractOpen} onClose={() => setIsContractOpen(false)} onSuccess={fetchData} />
      <NewInvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} onSuccess={fetchData} />
    </div>
  );
}
