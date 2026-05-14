"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { 
  BookCopy, 
  ClipboardList, 
  Copy, 
  FileText, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  BadgeDollarSign, 
  ScrollText, 
  CheckCircle2, 
  Printer, 
  ReceiptText, 
  ClipboardCheck, 
  NotepadText,
  ChevronRight,
  Download,
  Plus
} from 'lucide-react';
import DocumentTemplate from '@/components/DocumentTemplate';
import DocumentReaderModal from '@/components/DocumentReaderModal';
import AssociateDocumentsModal from '@/components/modals/AssociateDocumentsModal';
import { createClient } from '@/lib/supabase';
import { useProfile } from '@/lib/ProfileProvider';

type TemplateKey = 'INVOICE' | 'QUOTE' | 'CONTRACT' | 'PURCHASE_ORDER' | 'MINUTES' | 'ADMIN';

type TemplateItem = {
  key: TemplateKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  summary: string;
  copyText: string;
  render: React.ReactNode;
  kind: 'INVOICE' | 'CONTRACT' | 'ADMIN';
};

const sharedFooter = `OPAYS TECH S.A.R.L
Avenue de la Justice, Gombe, Kinshasa, RDC
contact@opays.tech | +243 000 000 000
`;

const invoiceCopy = `FACTURE OPAYS TECH
Référence: [INV-2026-001]
Date: [JJ/MM/AAAA]
Client: [Nom du client]
Adresse: [Adresse complète]

OBJET
Prestation de services liée à [projet / mission].

LIGNES
- Audit IA initial et cadrage
- Mise en place des automatisations
- Livraison et suivi

TOTAL NET À PAYER
[MONTANT] USD

CONDITIONS
- Paiement à échéance de [X] jours
- Retard de paiement: relance automatique
- Les montants sont exprimés hors taxes si applicable

${sharedFooter}`;

const contractCopy = `CONTRAT DE PRESTATION OPAYS TECH
Référence: [CTR-2026-001]
Date: [JJ/MM/AAAA]
Parties: OPAYS TECH et [Nom du client]

1. OBJET
Le présent contrat décrit la mission, les livrables, les délais et les conditions d'acceptation.

2. PÉRIMÈTRE
- Analyse du besoin
- Déploiement des solutions
- Formation et transfert
- Support convenu

3. LIVRABLES
- Document de cadrage
- Mise en production
- Rapport de clôture

4. CONFIDENTIALITÉ
Les informations échangées restent confidentielles.

5. MODALITÉS
- Délais: [X semaines]
- Facturation: selon jalons définis
- Résiliation: selon préavis convenu

6. SIGNATURES
OPAYS TECH: ____________________
Client: ________________________

${sharedFooter}`;

const quoteCopy = `DEVIS OPAYS TECH
Référence: [DEV-2026-001]
Date: [JJ/MM/AAAA]
Client: [Nom du client]
Objet: Proposition pour [mission / projet]

DÉTAIL
- Audit IA initial et cadrage
- Mise en place des automatisations
- Livraison et suivi

ESTIMATION
[MONTANT ESTIMÉ] USD

VALIDITÉ
Ce devis est valable pendant [X] jours.

${sharedFooter}`;

const purchaseOrderCopy = `BON DE COMMANDE
Référence: [BC-2026-001]
Date: [JJ/MM/AAAA]
Client: [Nom du client]
Fournisseur: OPAYS TECH

OBJET
Validation d'une commande ou d'une prestation déjà acceptée.

LIGNES
- [Produit / service] - [Quantité] - [Prix]

INSTRUCTIONS
- Démarrage après validation
- Livraison selon les conditions convenues

${sharedFooter}`;

const minutesCopy = `COMPTE RENDU DE RÉUNION
Référence: [CR-2026-001]
Date: [JJ/MM/AAAA]
Participants: [Noms]

POINTS DISCUTÉS
- [Point 1]
- [Point 2]
- [Point 3]

DÉCISIONS
- [Décision 1]
- [Décision 2]

ACTIONS
- [Action] - Responsable: [Nom] - Échéance: [Date]

${sharedFooter}`;

const adminCopy = `NOTE ADMINISTRATIVE
Référence: [ADM-2026-001]
Date: [JJ/MM/AAAA]
Objet: [Sujet]

CONTEXTE
[Décrire brièvement la situation]

DÉCISION
[Ce qui a été validé ou demandé]

ACTION
[Ce qui doit être fait, par qui, et pour quand]

VALIDATION
Sceau / signature à apposer si nécessaire.

${sharedFooter}`;

const templates: TemplateItem[] = [
  {
    key: 'QUOTE',
    title: 'Devis commercial',
    subtitle: 'Le premier document à envoyer.',
    icon: <ReceiptText size={20} />,
    summary: 'Très utile pour formaliser une proposition, cadrer le périmètre et poser une estimation simple.',
    copyText: quoteCopy,
    kind: 'INVOICE',
    render: (
      <DocumentTemplate
        type="QUOTE"
        title="Devis"
        reference="DEV-2026-001"
        date="12/05/2026"
        clientName="Client Démo"
        clientAddress={`Adresse du client\nVille, Pays`}
        items={[
          { description: 'Audit IA initial et cadrage', amount: 250 },
          { description: 'Mise en place des automatisations', amount: 1250 },
          { description: 'Formation et transfert', amount: 500 },
        ]}
        total={2000}
      />
    ),
  },
  {
    key: 'INVOICE',
    title: 'Facture standard',
    subtitle: 'Modèle prêt à copier et imprimer.',
    icon: <BadgeDollarSign size={20} />,
    summary: 'À utiliser pour toutes les factures client. Structure simple, lisible et compatible avec le sceau officiel.',
    copyText: invoiceCopy,
    kind: 'INVOICE',
    render: (
      <DocumentTemplate
        type="INVOICE"
        title="Facture"
        reference="INV-2026-001"
        date="12/05/2026"
        clientName="Client Démo"
        clientAddress={`Adresse du client\nVille, Pays`}
        items={[
          { description: 'Audit IA initial et cadrage', amount: 250 },
          { description: 'Mise en place des automatisations', amount: 1250 },
          { description: 'Formation et transfert', amount: 500 },
        ]}
        total={2000}
      />
    ),
  },
  {
    key: 'PURCHASE_ORDER',
    title: 'Bon de commande',
    subtitle: 'Validation client avant démarrage.',
    icon: <ClipboardCheck size={20} />,
    summary: 'Permet de confirmer la commande avant démarrage et d’éviter les zones floues.',
    copyText: purchaseOrderCopy,
    kind: 'CONTRACT',
    render: (
      <DocumentTemplate
        type="PURCHASE_ORDER"
        title="Bon de commande"
        reference="BC-2026-001"
        date="12/05/2026"
        clientName="Client Démo"
        clientAddress={`Adresse du client\nVille, Pays`}
        content={
          <div className="space-y-4 text-sm leading-relaxed">
            <p><strong>Objet :</strong> validation d'une commande ou d'une prestation acceptée.</p>
            <p><strong>Référence :</strong> ce document confirme ce qui a été convenu avant exécution.</p>
            <p><strong>Instructions :</strong> démarrage après validation, livraison selon les délais définis et suivi du point de contact.</p>
          </div>
        }
      />
    ),
  },
  {
    key: 'CONTRACT',
    title: 'Contrat de prestation',
    subtitle: 'Base claire pour une mission.',
    icon: <Scale size={20} />,
    summary: 'Pour cadrer une mission, préciser les livrables et protéger les deux parties.',
    copyText: contractCopy,
    kind: 'CONTRACT',
    render: (
      <DocumentTemplate
        type="CONTRACT"
        title="Contrat de prestation"
        reference="CTR-2026-001"
        date="12/05/2026"
        clientName="Client Démo"
        clientAddress={`Adresse du client\nVille, Pays`}
        content={
          <div className="space-y-4 text-sm leading-relaxed text-justify">
            <p>
              Le présent contrat encadre la prestation fournie par OPAYS TECH à {`[Nom du client]`} dans le cadre de {`[mission]`}.
            </p>
            <p>
              <strong>Objet :</strong> définir les livrables, les délais, les responsabilités et les conditions de validation.
            </p>
            <p>
              <strong>Périmètre :</strong> analyse du besoin, livraison, accompagnement, transfert de connaissances et suivi convenu.
            </p>
            <p>
              <strong>Confidentialité :</strong> les informations échangées dans le cadre de la mission sont protégées et ne peuvent pas être partagées sans autorisation.
            </p>
            <p>
              <strong>Signature :</strong> les parties valident ce contrat avant démarrage de la mission.
            </p>
          </div>
        }
      />
    ),
  },
  {
    key: 'MINUTES',
    title: 'Compte rendu',
    subtitle: 'Trace des décisions et actions.',
    icon: <NotepadText size={20} />,
    summary: 'Très utile pour les réunions CEO/COO, les points de suivi projet et les décisions d’équipe.',
    copyText: minutesCopy,
    kind: 'ADMIN',
    render: (
      <DocumentTemplate
        type="MINUTES"
        title="Compte rendu de réunion"
        reference="CR-2026-001"
        date="12/05/2026"
        clientName="Interne"
        content={
          <div className="space-y-4 text-sm leading-relaxed">
            <p><strong>Participants :</strong> [Noms]</p>
            <p><strong>Points discutés :</strong> [Point 1], [Point 2], [Point 3]</p>
            <p><strong>Décisions :</strong> ce qui a été validé et ce qui doit être suivi.</p>
            <p><strong>Actions :</strong> chaque action doit avoir un responsable et une date.</p>
          </div>
        }
      />
    ),
  },
  {
    key: 'ADMIN',
    title: 'Note administrative',
    subtitle: 'Décisions et instructions internes.',
    icon: <ScrollText size={20} />,
    summary: 'À utiliser pour les notes internes, instructions de direction, validations et comptes rendus simples.',
    copyText: adminCopy,
    kind: 'ADMIN',
    render: (
      <DocumentTemplate
        type="ADMIN"
        title="Note administrative"
        reference="ADM-2026-001"
        date="12/05/2026"
        clientName="Interne"
        content={
          <div className="space-y-4 text-sm leading-relaxed">
            <p><strong>Contexte :</strong> cette note sert à documenter une décision, une instruction ou une validation interne.</p>
            <p><strong>Décision :</strong> ce qui est validé doit être clair, simple et daté.</p>
            <p><strong>Action :</strong> chaque action doit avoir un responsable et une échéance.</p>
            <p><strong>Validation :</strong> le sceau officiel s’applique si le document doit être authentifié.</p>
          </div>
        }
      />
    ),
  },
];

const extraDocs = [
  'Devis commercial',
  'Bon de commande',
  'Bon de réception / service fait',
  'Attestation de travail',
  'Ordre de mission',
  'Note de frais',
  'Compte rendu de réunion',
  'NDA / accord de confidentialité',
  'Relance de paiement',
  'Rapport financier mensuel',
  'Fiche de paie',
  'Handover / transfert de livraison',
];

export default function DocumentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { isManager } = useProfile();
  const [selected, setSelected] = useState<TemplateKey>('INVOICE');
  const [modalOpen, setModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [privateDocs, setPrivateDocs] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const template = useMemo(() => templates.find((item) => item.key === selected) || templates[0], [selected]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const fetchPrivateDocs = async () => {
    const { data } = await supabase
      .from('associate_documents')
      .select('*, profiles(full_name, email)')
      .order('uploaded_at', { ascending: false });

    setPrivateDocs(data || []);

    if (isManager) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      setMembers(profileData || []);
    }
  };

  useEffect(() => {
    fetchPrivateDocs();
  }, [isManager, supabase]);

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <header className="space-y-3 print:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-sky-600">
            <BookCopy size={12} /> Modèles administratifs
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Standardisation des Documents</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-500 font-medium">
            Cette page regroupe les formats que l’équipe peut copier, personnaliser puis exporter en PDF. Le sceau officiel est déjà branché dans le modèle d’impression.
          </p>
        </header>

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm print:hidden">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">
                <ShieldCheck size={12} /> Cercle restreint
              </div>
              <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight text-slate-900">Documents privés</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                Chaque membre voit uniquement les documents qui lui sont assignés. Fenelon voit tout et peut partager un document à un utilisateur précis.
              </p>
            </div>
            {isManager && (
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedMember?.id || ''}
                  onChange={(event) => setSelectedMember(members.find((member) => member.id === event.target.value) || null)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 outline-none"
                >
                  <option value="">Choisir un membre</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name || member.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedMember && setShareOpen(true)}
                  disabled={!selectedMember}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={16} /> Partager
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {privateDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-slate-100 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-tight text-slate-900">{doc.title}</p>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                      {doc.type} {isManager && doc.profiles?.full_name ? `- ${doc.profiles.full_name}` : ''}
                    </p>
                  </div>
                  <Download size={16} className="text-slate-400" />
                </div>
              </a>
            ))}
            {privateDocs.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-medium text-slate-400">
                Aucun document privé disponible.
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-3 print:hidden">
            {templates.map((item) => {
              const active = item.key === selected;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelected(item.key)}
                  className={`w-full rounded-[2rem] border p-6 text-left transition-all ${
                    active
                      ? 'border-sky-600 bg-white shadow-xl shadow-sky-600/5 ring-1 ring-sky-600/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl p-3 border transition-all ${active ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h2 className={`text-base font-bold uppercase tracking-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{item.title}</h2>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{item.subtitle}</p>
                      <p className={`mt-3 text-sm leading-relaxed font-medium ${active ? 'text-slate-600' : 'text-slate-400'}`}>{item.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm print:hidden">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                    <Sparkles size={12} /> Format prêt à l'emploi
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">{template.title}</h2>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">{template.summary}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />} {copied ? 'Copié' : 'Copier le texte'}
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-3 text-xs font-bold text-sky-600 transition hover:bg-sky-100"
                  >
                    <FileText size={16} /> Lecture centrée
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-black"
                  >
                    <Printer size={16} /> Imprimer / PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 print:shadow-none print:border-none print:bg-transparent">
              {template.render}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 print:hidden">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Règle 1</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">Le texte doit rester simple et compréhensible par une personne non technique.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Règle 2</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">Le logo et le sceau doivent être visibles dans le rendu final exporté en PDF.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Règle 3</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">Quand le document est long, le PDF est la meilleure version à partager.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
              <ClipboardList size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.28em] text-slate-900">Autres documents à modéliser</h3>
          </div>
          <p className="mt-5 max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
            Ceux-ci peuvent être standardisés dès maintenant pour gagner du temps, homogénéiser la qualité et faciliter l’archivage PDF.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {extraDocs.map((doc) => (
              <div key={doc} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-200 transition-all cursor-pointer group">
                <span className="uppercase tracking-tight group-hover:text-slate-900">{doc}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-sm text-emerald-900">
            <div className="flex items-center gap-3 font-bold uppercase tracking-tight">
              <ShieldCheck size={18} className="text-emerald-600" /> Priorité recommandée
            </div>
            <p className="mt-3 leading-relaxed font-medium opacity-80">
              Devis, bon de commande, bon de réception, note de frais, ordre de mission et rapport financier mensuel sont les prochains documents les plus utiles à standardiser.
            </p>
          </div>
        </section>
      </div>

      <DocumentReaderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={template.title}
        subtitle={template.subtitle}
        content={template.copyText}
        badge="Modèle"
        sourceLabel="PDF recommandé"
        copyText={template.copyText}
      />
      <AssociateDocumentsModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}
