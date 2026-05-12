"use client";

import React, { useMemo, useState } from 'react';
import { BookCopy, ClipboardList, Copy, FileText, Scale, ShieldCheck, Sparkles, BadgeDollarSign, ScrollText, CheckCircle2 } from 'lucide-react';
import DocumentTemplate from '@/components/DocumentTemplate';
import DocumentReaderModal from '@/components/DocumentReaderModal';

type TemplateKey = 'INVOICE' | 'CONTRACT' | 'ADMIN';

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
    key: 'INVOICE',
    title: 'Facture standard',
    subtitle: 'Modèle prêt à copier, à imprimer et à exporter en PDF.',
    icon: <BadgeDollarSign size={18} />,
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
    key: 'CONTRACT',
    title: 'Contrat de prestation',
    subtitle: 'Base claire pour une prestation, un projet ou un accompagnement.',
    icon: <Scale size={18} />,
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
    key: 'ADMIN',
    title: 'Note administrative',
    subtitle: 'Format simple pour décisions internes, validations et instructions.',
    icon: <ScrollText size={18} />,
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
  const [selected, setSelected] = useState<TemplateKey>('INVOICE');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const template = useMemo(() => templates.find((item) => item.key === selected) || templates[0], [selected]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_24%),linear-gradient(180deg,#050816_0%,#090d19_48%,#0b1020_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200 backdrop-blur">
            <BookCopy size={12} /> Modèles administratifs
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Factures, contrats et documents à standardiser</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400">
            Cette page regroupe les formats que l’équipe peut copier, personnaliser puis exporter en PDF. Le sceau officiel est déjà branché dans le modèle d’impression.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4">
            {templates.map((item) => {
              const active = item.key === selected;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelected(item.key)}
                  className={`w-full rounded-[1.75rem] border p-5 text-left backdrop-blur-xl transition ${
                    active
                      ? 'border-cyan-400/30 bg-cyan-400/10 shadow-xl shadow-cyan-400/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-white">{item.title}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{item.subtitle}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-300">
                    <Sparkles size={12} /> Format prêt à copier
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">{template.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-400">{template.summary}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-300" /> : <Copy size={16} />} {copied ? 'Copié' : 'Copier le texte'}
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                  >
                    <FileText size={16} /> Ouvrir en lecture centrée
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {template.render}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Règle 1</p>
                <p className="mt-2 leading-relaxed">Le texte doit rester simple et compréhensible par une personne non technique.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Règle 2</p>
                <p className="mt-2 leading-relaxed">Le logo et le sceau doivent être visibles dans le rendu final exporté en PDF.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Règle 3</p>
                <p className="mt-2 leading-relaxed">Quand le document est long, le PDF est la meilleure version à partager.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-300">
            <ClipboardList size={18} />
            <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">Autres documents à modéliser</h3>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
            Ceux-ci peuvent être standardisés dès maintenant pour gagner du temps, homogénéiser la qualité et faciliter l’archivage PDF.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {extraDocs.map((doc) => (
              <div key={doc} className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-200">
                {doc}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={16} /> Priorité recommandée
            </div>
            <p className="mt-2 leading-relaxed">
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
    </div>
  );
}
