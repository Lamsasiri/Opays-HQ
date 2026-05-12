"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import DocumentReaderModal from '@/components/DocumentReaderModal';
import { 
  Target, 
  Zap, 
  TrendingDown, 
  DollarSign, 
  ArrowRight, 
  Calculator, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Presentation,
  Briefcase,
  Share2,
  Download,
  Info
} from 'lucide-react';

const ToolCard = ({ title, description, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border text-left transition-all group backdrop-blur-xl ${active ? 'border-cyan-500/30 bg-cyan-500/10 text-white shadow-2xl shadow-cyan-500/10' : 'border-white/10 bg-white/5 text-slate-100 hover:border-cyan-500/20 hover:bg-white/8'}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${active ? 'bg-white/15 text-white' : 'bg-white/5 text-cyan-300 group-hover:bg-cyan-500/10'}`}>
      {icon}
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className={`text-xs leading-relaxed ${active ? 'text-cyan-100' : 'text-slate-400'}`}>{description}</p>
  </button>
);

export default function StudioPage() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('roi');
  const [step, setStep] = useState(1);
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerDoc, setReaderDoc] = useState<{ title: string; subtitle: string; content?: string; pdfUrl?: string | null; badge?: string; sourceLabel?: string } | null>(null);
  const supabase = createClient();

  const [data, setData] = useState({
    companyName: '',
    niche: '',
    salaryMonthly: 2500,
    employerLoadPercent: 35,
    hoursLostWeekly: 10,
    productiveHoursMonthly: 140,
    dealValue: 5000,
    dealsLostMonthly: 1,
    errorCostMonthly: 500,
    opaysMonthlyCost: 600,
    implementationCost: 5000,
    confidencePercent: 80
  });

  const fetchSimulations = async () => {
    const { data: sims } = await supabase.from('roi_simulations').select('*').order('created_at', { ascending: false });
    if (sims) setSimulations(sims);
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const calculateROI = () => {
    const loadedSalaryMonthly = data.salaryMonthly * (1 + data.employerLoadPercent / 100);
    const hourlyRate = loadedSalaryMonthly / Math.max(data.productiveHoursMonthly, 1);
    const directLaborCostAnnual = hourlyRate * data.hoursLostWeekly * 52;
    const errorCostAnnual = data.errorCostMonthly * 12;
    const opportunityCostAnnual = data.dealValue * data.dealsLostMonthly * 12;
    const bruteLeak = directLaborCostAnnual + opportunityCostAnnual + errorCostAnnual;
    const confidenceAdjustedLeak = bruteLeak * (data.confidencePercent / 100);
    const opaysAnnualCost = data.opaysMonthlyCost * 12;
    const netAnnualGain = confidenceAdjustedLeak - opaysAnnualCost;
    
    return {
      totalLeak: bruteLeak,
      netAnnualGain,
      directLaborCostAnnual,
      opportunityCostAnnual
    };
  };

  const results = calculateROI();

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('roi_simulations').insert([{
      company_name: data.companyName,
      sector: data.niche,
      salary_monthly: data.salaryMonthly,
      hours_lost_weekly: data.hoursLostWeekly,
      deal_value: data.dealValue,
      deals_lost_monthly: data.dealsLostMonthly,
      total_leak_annual: results.totalLeak,
      net_gain_annual: results.netAnnualGain,
      created_by: user?.id
    }]);

    if (!error) {
      alert("Simulation enregistrée !");
      fetchSimulations();
      setStep(1);
    }
    setLoading(false);
  };

  const openDocument = (type: 'pitch' | 'cases' | 'audit') => {
    const docs = {
      pitch: {
        title: "Guide de Pitch Commercial \u2014 Opays Tech",
        subtitle: "Support complet pour pr\u00e9parer et r\u00e9ussir chaque prise de parole commerciale.",
        badge: 'Vente',
        sourceLabel: 'Guide interne',
        pdfUrl: null,
        content: `# Guide de Pitch Commercial \u2014 Opays Tech

## 1. AVANT LE PITCH : PR\u00c9PARER LE TERRAIN

### Q: Que dois-je savoir avant de parler au client ?
- Le nom du d\u00e9cideur et son r\u00f4le exact dans l\u2019entreprise.
- Le secteur d\u2019activit\u00e9 et les d\u00e9fis typiques de ce secteur.
- Ce que le client fait actuellement (manuellement ou avec un outil existant).
- Ce qui l\u2019a pouss\u00e9 \u00e0 accepter le rendez-vous : un probl\u00e8me urgent, une curiosit\u00e9, une recommandation.
- Ne jamais arriver sans avoir fait 10 minutes de recherche sur l\u2019entreprise.

### Q: Quelle attitude adopter ?
- \u00catre calme, professionnel et \u00e0 l\u2019\u00e9coute. On n\u2019est pas l\u00e0 pour vendre, on est l\u00e0 pour comprendre.
- Parler comme un conseiller, pas comme un vendeur.
- Si on ne sait pas, on dit "Je vais v\u00e9rifier et revenir vers vous."

## 2. LA STRUCTURE DU PITCH (5 MINUTES MAX)

### Q: Comment organiser un pitch efficace ?
1. **Le constat** (30 sec) \u2014 D\u00e9crivez un probl\u00e8me que le client vit probablement : "Beaucoup d\u2019entreprises de votre secteur perdent du temps sur des t\u00e2ches qui pourraient \u00eatre simplifi\u00e9es."
2. **L\u2019impact** (30 sec) \u2014 Chiffrez la douleur : "En moyenne, cela repr\u00e9sente X heures par semaine et Y dollars par an de co\u00fbt cach\u00e9."
3. **Notre approche** (1 min) \u2014 "Nous analysons vos processus, identifions les goulots, et mettons en place des solutions qui simplifient le travail."
4. **La preuve** (1 min) \u2014 Donnez un exemple concret : "Pour une entreprise similaire, nous avons r\u00e9duit le temps de traitement de 40%."
5. **La prochaine \u00e9tape** (30 sec) \u2014 "Si cela vous int\u00e9resse, nous pouvons faire un audit gratuit de 2 heures."

## 3. LES PHRASES CL\u00c9S \u00c0 UTILISER

### Q: Quelles phrases fonctionnent bien ?
- "Notre objectif, c\u2019est de vous faire gagner du temps sur ce qui n\u2019a pas de valeur ajout\u00e9e."
- "On ne remplace personne \u2014 on enl\u00e8ve les t\u00e2ches qui fatiguent votre \u00e9quipe."
- "Le but, c\u2019est que votre \u00e9quipe se concentre sur ce qu\u2019elle fait de mieux."
- "Nous commen\u00e7ons toujours par un diagnostic \u2014 pas de solution sans compr\u00e9hension."
- "Ce n\u2019est pas de la magie, c\u2019est de la m\u00e9thode."

### Q: Quelles phrases \u00e9viter ?
- "L\u2019IA va r\u00e9volutionner votre business." \u2192 Trop vague, trop prometteur.
- "Nos solutions sont \u00e0 la pointe de la technologie." \u2192 Le client veut des r\u00e9sultats, pas du jargon.
- "C\u2019est tr\u00e8s simple." \u2192 Rien n\u2019est simple quand on change les habitudes.

## 4. G\u00c9RER LES OBJECTIONS

### Q: "C\u2019est trop cher pour nous."
- "Je comprends. Justement, notre audit initial mesure combien vous perdez aujourd\u2019hui. Souvent, le co\u00fbt de ne rien faire est plus \u00e9lev\u00e9."

### Q: "On n\u2019est pas pr\u00eats pour l\u2019IA."
- "En r\u00e9alit\u00e9, il s\u2019agit de simplifier vos processus. L\u2019IA est un outil parmi d\u2019autres, on l\u2019utilise quand c\u2019est pertinent."

### Q: "On a d\u00e9j\u00e0 essay\u00e9 et \u00e7a n\u2019a pas march\u00e9."
- "C\u2019est pour \u00e7a qu\u2019on commence par comprendre ce qui n\u2019a pas fonctionn\u00e9. Notre approche est progressive."

## 5. APR\u00c8S LE PITCH

### Q: Que faire juste apr\u00e8s ?
- Envoyer un r\u00e9sum\u00e9 par email dans les 2 heures.
- Proposer une date pour l\u2019audit ou le prochain \u00e9change.
- Ajouter le lead dans le CRM avec les notes de conversation.
- Partager un retour \u00e0 l\u2019\u00e9quipe lors du point commercial hebdomadaire.`,
      },
      cases: {
        title: "\u00c9tudes de Cas \u2014 Opays Tech",
        subtitle: "Comment documenter, structurer et pr\u00e9senter nos succ\u00e8s pour convaincre de futurs clients.",
        badge: 'Preuve',
        sourceLabel: 'Guide interne',
        pdfUrl: null,
        content: `# Guide des \u00c9tudes de Cas \u2014 Opays Tech

## 1. POURQUOI UNE \u00c9TUDE DE CAS EST INDISPENSABLE

### Q: Pourquoi documenter nos projets ?
- Parce qu\u2019un client ne nous croit pas sur parole \u2014 il veut voir ce qu\u2019on a d\u00e9j\u00e0 fait.
- Parce qu\u2019une bonne \u00e9tude de cas vend mieux qu\u2019un long discours.
- Parce qu\u2019elle montre qu\u2019on a de l\u2019exp\u00e9rience, de la m\u00e9thode et des r\u00e9sultats mesurables.

### Q: Quand cr\u00e9er une \u00e9tude de cas ?
- Apr\u00e8s chaque projet livr\u00e9 avec succ\u00e8s.
- Quand le client est satisfait et accepte d\u2019\u00eatre cit\u00e9 (m\u00eame anonymement).
- Quand les r\u00e9sultats sont mesurables : temps gagn\u00e9, erreurs r\u00e9duites, CA pr\u00e9serv\u00e9.

## 2. LA STRUCTURE

### Q: Quel plan suivre ?
1. **Le contexte** \u2014 Qui est le client ? Secteur ? Taille de l\u2019\u00e9quipe ?
2. **Le probl\u00e8me** \u2014 Qu\u2019est-ce qui ne fonctionnait pas ? Combien \u00e7a co\u00fbtait ?
3. **Notre diagnostic** \u2014 Qu\u2019avons-nous identifi\u00e9 comme cause principale ?
4. **La solution** \u2014 Qu\u2019avons-nous fait concr\u00e8tement ? En combien de temps ?
5. **Les r\u00e9sultats** \u2014 Qu\u2019est-ce qui a chang\u00e9 ? Quels chiffres le prouvent ?
6. **Le t\u00e9moignage** (optionnel) \u2014 Une phrase du client qui r\u00e9sume l\u2019impact.

## 3. LES BONNES PRATIQUES

### Q: Comment \u00e9crire pour que ce soit cr\u00e9dible ?
- Utiliser des chiffres r\u00e9els : "40% de temps gagn\u00e9" est plus fort que "beaucoup de temps gagn\u00e9".
- Rester honn\u00eate : si on n\u2019a r\u00e9solu que 2 probl\u00e8mes sur 5, on le dit.
- \u00c9crire comme si on expliquait \u00e0 un dirigeant non technique.
- Garder le document court : 1 \u00e0 2 pages maximum.
- Ajouter un visuel si possible : avant/apr\u00e8s, graphique, capture.

## 4. EXEMPLE CONCRET

### Contexte
- Entreprise de services B2B, 15 employ\u00e9s, bas\u00e9e \u00e0 Kinshasa.
- L\u2019\u00e9quipe commerciale passait 60% de son temps sur l\u2019administratif.

### Probl\u00e8me
- Devis cr\u00e9\u00e9s manuellement dans Word \u2014 45 minutes par devis.
- Relances clients non suivies \u2014 3 opportunit\u00e9s perdues par mois.
- Aucun tableau de bord pour le dirigeant.

### Diagnostic Opays
- Processus de devis non standardis\u00e9.
- Absence de suivi centralis\u00e9 des prospects.
- Pas de visibilit\u00e9 sur les performances commerciales.

### Solution mise en place
- G\u00e9n\u00e9rateur de devis automatis\u00e9 (temps : 5 minutes au lieu de 45).
- CRM simple pour suivre les prospects par \u00e9tape.
- Tableau de bord mensuel avec les KPIs essentiels.

### R\u00e9sultats (apr\u00e8s 3 mois)
- Temps de cr\u00e9ation des devis r\u00e9duit de 90%.
- 0 opportunit\u00e9 perdue par oubli de relance.
- Vue claire du pipeline en temps r\u00e9el.
- ROI : co\u00fbt de la solution amorti en 2 mois.

## 5. UTILISATION

### Q: Comment utiliser une \u00e9tude de cas ?
- L\u2019envoyer par email apr\u00e8s un premier rendez-vous prometteur.
- La partager sur LinkedIn sous forme de post r\u00e9sum\u00e9.
- La pr\u00e9senter en r\u00e9union pour illustrer un point concret.
- La mettre \u00e0 disposition de toute l\u2019\u00e9quipe commerciale ici.`,
      },
      audit: {
        title: "M\u00e9thodologie d'Audit Opays Tech",
        subtitle: "Le guide complet pour mener un diagnostic op\u00e9rationnel et identifier les leviers de croissance.",
        badge: 'Audit',
        sourceLabel: 'Interne',
        pdfUrl: null,
        content: `# M\u00e9thodologie d'Audit Opays Tech

## 1. INTRODUCTION \u00c0 L'AUDIT

### Q: Quel est l'objectif principal de l'audit ?
- L'audit n'est pas un contr\u00f4le, c'est une exploration.
- Le but est d'identifier les \"frictions\" : tout ce qui ralentit l'\u00e9quipe, g\u00e9n\u00e8re des erreurs ou co\u00fbte de l'argent sans cr\u00e9er de valeur.
- L'audit doit d\u00e9boucher sur un plan d'action concret avec un ROI mesurable.

## 2. LES 4 PILIERS DU DIAGNOSTIC

### Pilier 1 : Flux d'Information
- Comment l'information circule-t-elle du client vers l'\u00e9quipe ?
- Y a-t-il des ruptures (passages du papier au num\u00e9rique, ressaisie de donn\u00e9es) ?
- Qui attend qui ? O\u00f9 sont les goulots d'\u00e9tranglement ?

### Pilier 2 : T\u00e2ches R\u00e9p\u00e9titives
- Quelles sont les t\u00e2ches faites plus de 10 fois par semaine ?
- Quelle est la part de travail manuel sans valeur ajout\u00e9e (copier-coller, tri d'emails) ?
- Combien de temps cela repr\u00e9sente-t-il par collaborateur ?

### Pilier 3 : Gestion des Erreurs
- Quelles sont les erreurs les plus fr\u00e9quentes (oublis de relance, fautes dans les devis, retards) ?
- Quel est le co\u00fbt direct et indirect de ces erreurs (temps de correction, client perdu) ?

### Pilier 4 : Outillage Actuel
- Quels outils sont utilis\u00e9s ? Sont-ils connect\u00e9s entre eux ?
- L'\u00e9quipe est-elle form\u00e9e \u00e0 ces outils ?

## 3. D\u00c9ROULEMENT DE LA MISSION

### \u00c9tape 1 : Immersion (1-2 jours)
- Observation directe des postes de travail.
- Interviews individuelles courtes (15-20 min) avec les collaborateurs cl\u00e9s.
- Collecte des documents types (devis, factures, emails types).

### \u00c9tape 2 : Analyse et Chiffrage (1 jour)
- Traduction des frictions en co\u00fbts financiers (via le calculateur ROI).
- Identification des 3 priorit\u00e9s d'automatisation.
- R\u00e9daction du rapport de diagnostic.

### \u00c9tape 3 : Pr\u00e9sentation de la Roadmap
- Pr\u00e9sentation au d\u00e9cideur : Probl\u00e8mes \u2192 Impact \u2192 Solution \u2192 Gain attendu.

## 4. POSTURE DE L'AUDITEUR

### Q: Comment se comporter face \u00e0 l'\u00e9quipe ?
- \u00catre un alli\u00e9, pas un inspecteur.
- Rassurer sur le fait que l'IA ne remplace pas l'humain, mais supprime les t\u00e2ches p\u00e9nibles.
- \u00c9couter plus que parler. Noter les frustrations, car c'est l\u2019\u00e0 que se trouve la valeur.`,
      },
    };

    setReaderDoc(docs[type as keyof typeof docs]);
    setReaderOpen(true);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.12),_transparent_26%),linear-gradient(180deg,#050816_0%,#090d1d_58%,#0b1020_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-10 p-6 md:p-8">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-blue-600/15 to-violet-600/15 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="absolute right-0 top-0 p-12 opacity-10">
          <Presentation size={140} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white mb-4">
            <Target size={12} /> Hub Marketing & Ventes
          </div>
          <h1 className="text-4xl font-semibold mb-4 tracking-tight">Outils de Croissance Studio</h1>
          <p className="text-slate-200/80 leading-relaxed text-sm">
            Bienvenue dans votre <strong>espace de vente</strong>. Utilisez ces outils pour convaincre vos clients, générer des analyses de rentabilité (ROI) et accéder aux ressources de présentation officielles d'OPAYS TECH.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ToolCard 
          title="Calculateur ROI" 
          description="Démontrez l'intérêt financier de l'automatisation pour vos prospects."
          icon={<Calculator size={24} />}
          active={activeTool === 'roi'}
          onClick={() => setActiveTool('roi')}
        />
        <ToolCard 
          title="Templates Pitch" 
          description="Accédez aux présentations de vente et decks investisseurs."
          icon={<Presentation size={24} />}
          active={activeTool === 'pitch'}
          onClick={() => {
            setActiveTool('pitch');
            openDocument('pitch');
          }}
        />
        <ToolCard 
          title="\u00c9tudes de Cas" 
          description="D\u00e9montrez vos succ\u00e8s pass\u00e9s avec des rapports d\u00e9taill\u00e9s."
          icon={<FileText size={24} />}
          active={activeTool === 'cases'}
          onClick={() => {
            setActiveTool('cases');
            openDocument('cases');
          }}
        />
        <ToolCard 
          title="M\u00e9thodologie d'Audit" 
          description="Le cadre structur\u00e9 pour diagnostiquer une entreprise."
          icon={<Target size={24} />}
          active={activeTool === 'audit'}
          onClick={() => {
            setActiveTool('audit');
            openDocument('audit');
          }}
        />
        <ToolCard 
          title="G\u00e9n\u00e9rateur de Devis" 
          description="Cr\u00e9ez des estimations rapides pour vos solutions IA."
          icon={<Briefcase size={24} />}
          active={activeTool === 'quotes'}
          onClick={() => setActiveTool('quotes')}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {activeTool === 'roi' ? (
          <>
            <div className="lg:col-span-2 space-y-8 rounded-[2.25rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
                  <Calculator className="text-cyan-300" size={24} /> Simulateur de Rentabilité
                </h2>
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`w-8 h-1 rounded-full ${s <= step ? 'bg-cyan-400' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Entreprise Prospect</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Entreprise X"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
                        value={data.companyName}
                        onChange={(e) => setData({...data, companyName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Secteur</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Logistique"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
                        value={data.niche}
                        onChange={(e) => setData({...data, niche: e.target.value})}
                      />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-900 transition hover:bg-slate-100">
                    Suivant <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Salaire Brut ($)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none focus:border-cyan-500/40"
                        value={data.salaryMonthly}
                        onChange={(e) => setData({...data, salaryMonthly: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Heures Perdues / Sem.</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none focus:border-cyan-500/40"
                        value={data.hoursLostWeekly}
                        onChange={(e) => setData({...data, hoursLostWeekly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-300 hover:bg-white/10">Retour</button>
                    <button onClick={() => setStep(3)} className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-900 hover:bg-slate-100">Continuer <ArrowRight size={16} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <Info size={18} className="text-orange-500 mt-0.5" />
                    <p className="text-xs text-orange-800 leading-relaxed italic">
                      Ces données permettent d'ajuster le "Cout d'Opportunité", l'un des leviers les plus puissants pour closer un contrat.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Valeur Contrat Moyen ($)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none focus:border-cyan-500/40"
                        value={data.dealValue}
                        onChange={(e) => setData({...data, dealValue: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Leads Perdus / Mois</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none focus:border-cyan-500/40"
                        value={data.dealsLostMonthly}
                        onChange={(e) => setData({...data, dealsLostMonthly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-300 hover:bg-white/10">Retour</button>
                    <button 
                      onClick={handleSave} 
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-xs font-bold uppercase tracking-[0.28em] text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer la Simulation'} <CheckCircle size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 p-8 text-white space-y-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <DollarSign size={120} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Rapport de Fuite de Capitaux</p>
              <h2 className="text-5xl font-black text-white">{Math.round(results.totalLeak).toLocaleString()} $ / an</h2>
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Clock size={16} /> Main d'œuvre gaspillée</span>
                  <span className="font-bold text-red-400">-{Math.round(results.directLaborCostAnnual).toLocaleString()} $</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><AlertTriangle size={16} /> Opportunités manquées</span>
                  <span className="font-bold text-red-400">-{Math.round(results.opportunityCostAnnual).toLocaleString()} $</span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6">
                <h3 className="font-bold flex items-center gap-2 text-sm"><Zap size={16} /> Gain net potentiel</h3>
                <p className="text-3xl font-black mt-2">{Math.round(results.netAnnualGain).toLocaleString()} $</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2 mt-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-900 transition hover:bg-slate-100">
                  <Download size={14} /> Télécharger PDF
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-[2.25rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-white">
                <Clock size={18} className="text-slate-500" /> Historique des Simulations
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {simulations.map((sim) => (
                  <div key={sim.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/20 hover:bg-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-white">{sim.company_name}</p>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{sim.sector}</p>
                      </div>
                      <div className="rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                        +{Math.round(sim.net_gain_annual).toLocaleString()} $
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[10px] text-slate-400">{new Date(sim.created_at).toLocaleDateString()}</span>
                      <button className="text-[10px] font-bold text-cyan-300 hover:underline">Charger</button>
                    </div>
                  </div>
                ))}
                {simulations.length === 0 && (
                  <p className="col-span-full py-10 text-center text-sm italic text-slate-400">Aucune simulation enregistrée.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 rounded-[2.25rem] border border-white/10 bg-white/5 p-12 text-center space-y-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
              <Presentation size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Ressources en cours de synchronisation</h2>
              <p className="mx-auto mt-2 max-w-md text-slate-400">
                Nous préparons les templates de Pitch et les Études de Cas officiels pour votre secteur. Revenez bientôt !
              </p>
            </div>
            <button 
              onClick={() => setActiveTool('roi')}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-300 transition hover:bg-white/10"
            >
              Retour au calculateur
            </button>
          </div>
        )}
      </div>

      <DocumentReaderModal
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
        title={readerDoc?.title || ''}
        subtitle={readerDoc?.subtitle}
        content={readerDoc?.content}
        pdfUrl={readerDoc?.pdfUrl}
        badge={readerDoc?.badge}
        sourceLabel={readerDoc?.sourceLabel}
      />

      </div>
    </div>
  );
}
