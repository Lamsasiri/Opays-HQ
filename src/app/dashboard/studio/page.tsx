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
  Info,
  Sparkles
} from 'lucide-react';

const ToolCard = ({ title, description, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border text-left transition-all group ${active ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-lg shadow-cyan-500/10' : 'border-slate-200 bg-white text-slate-900 hover:border-cyan-300 hover:bg-slate-50 shadow-sm'}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${active ? 'bg-cyan-600 text-white' : 'bg-slate-50 text-cyan-600 group-hover:bg-cyan-100'}`}>
      {icon}
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className={`text-xs leading-relaxed ${active ? 'text-cyan-800' : 'text-slate-500'}`}>{description}</p>
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

  const [realDocs, setRealDocs] = useState<any[]>([]);

  const fetchSimulations = async () => {
    const { data: sims } = await supabase.from('roi_simulations').select('*').order('created_at', { ascending: false });
    if (sims) setSimulations(sims);
  };

  const fetchRealDocs = async () => {
    const { data: docs } = await supabase
      .from('global_documents')
      .select('*')
      .in('category', ['PITCH', 'CASE_STUDY', 'METHODOLOGY']);
    if (docs) setRealDocs(docs);
  };

  useEffect(() => {
    fetchSimulations();
    fetchRealDocs();
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
    const categoryMap: any = {
      pitch: 'PITCH',
      cases: 'CASE_STUDY',
      audit: 'METHODOLOGY'
    };
    
    const doc = realDocs.find(d => d.category === categoryMap[type]);

    if (doc) {
      setReaderDoc({
        title: doc.title,
        subtitle: `Ressource officielle Opays • ${doc.category}`,
        pdfUrl: doc.url,
        badge: 'HQ',
        sourceLabel: 'Standard Opays'
      });
      setReaderOpen(true);
    } else {
      // Fallback to static if none found
      const staticDocs: any = {
        pitch: {
          title: "Templates Pitch Commercial",
          subtitle: "Support complet pour convaincre vos prospects.",
          badge: 'VENTE',
          sourceLabel: 'Ressource Interne',
          content: `### Présentation Vision Opays Tech\n\nCe deck est conçu pour les rendez-vous de découverte de niveau C-Suite.\n\n**Structure recommandée :**\n1. **Le Problème** : Inefficacités structurelles en Afrique francophone.\n2. **La Solution** : Automatisation intelligente et souveraineté.\n3. **ROI** : Chiffres clés basés sur nos audits flash.\n4. **Engagement** : Prochaine étape immédiate (Audit Flash).`
        },
        cases: {
          title: "Études de Cas de Référence",
          subtitle: "Nos succès réels sur le terrain.",
          badge: 'RÉUSSITE',
          sourceLabel: 'Archive Client',
          content: `### Cas #01 : Secteur Logistique (Lubumbashi)\n- **Défi** : 15 heures de saisie manuelle par jour.\n- **Solution** : Robot d'automatisation de facturation.\n- **Impact** : Réduction de 90% des erreurs et gain de 3 ETP.\n\n### Cas #02 : Secteur Légal\n- **Défi** : Analyse de contrats chronophage.\n- **Solution** : RAG privé (LLM local).\n- **Impact** : Analyse de conformité divisée par 5.`
        },
        audit: {
          title: "Méthodologie d'Audit Tactique",
          subtitle: "Cadre d'analyse pour diagnostiquer une structure.",
          badge: 'MÉTHODE',
          sourceLabel: 'Standard Opays',
          content: `### Phases du Diagnostic Opays\n\n**1. Mapping des Flux**\nIdentifier chaque point de contact humain avec la donnée.\n\n**2. Quantification de la Friction**\nCalculer le temps de latence entre l'intention et l'exécution.\n\n**3. Identification des Points de Rupture**\nOù perdons-nous le plus d'argent ? (Erreurs, Oublis, Délais).`
        }
      };
      setReaderDoc(staticDocs[type]);
      setReaderOpen(true);
    }
  };

  return (
    <div className="relative min-h-full text-slate-900 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-10 p-6 md:p-8">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="absolute right-0 top-0 p-12 opacity-[0.03] text-slate-900 pointer-events-none">
          <Presentation size={140} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-700 mb-4">
            <Target size={12} /> Hub Marketing & Ventes
          </div>
          <h1 className="text-4xl font-semibold mb-4 tracking-tight text-slate-900">Outils de Croissance Studio</h1>
          <p className="text-slate-600 leading-relaxed text-sm">
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
          onClick={() => setActiveTool('pitch')}
        />
        <ToolCard 
          title="Études de Cas" 
          description="Démontrez vos succès passés avec des rapports détaillés."
          icon={<FileText size={24} />}
          active={activeTool === 'cases'}
          onClick={() => setActiveTool('cases')}
        />
        <ToolCard 
          title="Méthodologie d'Audit" 
          description="Le cadre structuré pour diagnostiquer une entreprise."
          icon={<Target size={24} />}
          active={activeTool === 'audit'}
          onClick={() => setActiveTool('audit')}
        />
        <ToolCard 
          title="Générateur de Devis" 
          description="Créez des estimations rapides pour vos solutions IA."
          icon={<Briefcase size={24} />}
          active={activeTool === 'quotes'}
          onClick={() => setActiveTool('quotes')}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {activeTool === 'roi' ? (
          <>
            <div className="lg:col-span-2 space-y-8 rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                  <Calculator className="text-cyan-600" size={24} /> Simulateur de Rentabilité
                </h2>
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`w-8 h-1 rounded-full ${s <= step ? 'bg-cyan-500' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Entreprise Prospect</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Entreprise X"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.companyName}
                        onChange={(e) => setData({...data, companyName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Secteur</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Logistique"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.niche}
                        onChange={(e) => setData({...data, niche: e.target.value})}
                      />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-4 text-xs font-bold uppercase tracking-[0.28em] text-white transition hover:bg-cyan-700 shadow-lg shadow-cyan-500/20">
                    Suivant <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Salaire Brut ($)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.salaryMonthly}
                        onChange={(e) => setData({...data, salaryMonthly: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Heures Perdues / Sem.</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.hoursLostWeekly}
                        onChange={(e) => setData({...data, hoursLostWeekly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-500 hover:bg-slate-50">Retour</button>
                    <button onClick={() => setStep(3)} className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-4 text-xs font-bold uppercase tracking-[0.28em] text-white hover:bg-cyan-700 shadow-lg shadow-cyan-500/20">Continuer <ArrowRight size={16} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <Info size={18} className="text-orange-600 mt-0.5" />
                    <p className="text-xs text-orange-800 leading-relaxed italic">
                      Ces données permettent d'ajuster le "Cout d'Opportunité", l'un des leviers les plus puissants pour closer un contrat.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Valeur Contrat Moyen ($)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.dealValue}
                        onChange={(e) => setData({...data, dealValue: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Leads Perdus / Mois</label>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-cyan-500/40 focus:bg-white transition-all"
                        value={data.dealsLostMonthly}
                        onChange={(e) => setData({...data, dealsLostMonthly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-xs font-bold uppercase tracking-[0.28em] text-slate-500 hover:bg-slate-50">Retour</button>
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

            <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-8 text-slate-900 space-y-8 shadow-sm">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-slate-900 pointer-events-none">
                <DollarSign size={120} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-600">Rapport de Fuite de Capitaux</p>
              <h2 className="text-5xl font-black text-slate-900">{Math.round(results.totalLeak).toLocaleString()} $ / an</h2>
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Clock size={16} /> Main d'œuvre gaspillée</span>
                  <span className="font-bold text-red-600">-{Math.round(results.directLaborCostAnnual).toLocaleString()} $</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><AlertTriangle size={16} /> Opportunités manquées</span>
                  <span className="font-bold text-red-600">-{Math.round(results.opportunityCostAnnual).toLocaleString()} $</span>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
                <h3 className="font-bold flex items-center gap-2 text-sm text-cyan-700 uppercase tracking-wider"><Zap size={16} /> Gain net potentiel</h3>
                <p className="text-3xl font-black mt-2 text-slate-900">{Math.round(results.netAnnualGain).toLocaleString()} $</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-2 mt-4 text-xs font-bold uppercase tracking-[0.28em] text-white transition hover:bg-cyan-700 shadow-lg shadow-cyan-500/20">
                  <Download size={14} /> Télécharger PDF
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock size={18} className="text-slate-400" /> Historique des Simulations
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {simulations.map((sim) => (
                  <div key={sim.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-cyan-200 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{sim.company_name}</p>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-bold">{sim.sector}</p>
                      </div>
                      <div className="rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                        +{Math.round(sim.net_gain_annual).toLocaleString()} $
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(sim.created_at).toLocaleDateString()}</span>
                      <button className="text-[10px] font-bold text-cyan-600 hover:underline">Charger</button>
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
          <div className="lg:col-span-3 rounded-[2.25rem] border border-slate-200 bg-white p-12 space-y-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-cyan-600">
              <Sparkles size={200} />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-cyan-600 flex items-center justify-center text-white shadow-xl shadow-cyan-600/20">
                {activeTool === 'pitch' ? <Presentation size={40} /> : activeTool === 'cases' ? <FileText size={40} /> : <Target size={40} />}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
                  {activeTool === 'pitch' ? 'Ressources de Pitch' : activeTool === 'cases' ? 'Études de Cas' : 'Méthode d\'Audit'}
                </h2>
                <p className="text-slate-500 font-medium">Contenu opérationnel prêt à l'emploi pour vos démarches.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Support Interactif</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Accédez à la version complète et interactive de ce support pour l'utiliser en rendez-vous ou le partager.
                </p>
                <button 
                  onClick={() => openDocument(activeTool as any)}
                  className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/10 transition hover:bg-black"
                >
                  Ouvrir le Support <ArrowRight size={16} />
                </button>
              </div>
              <div className="p-8 bg-cyan-50 rounded-[2rem] border border-cyan-100 space-y-6">
                <h3 className="text-lg font-bold text-cyan-900 uppercase tracking-tight">Checklist Tactical</h3>
                <ul className="space-y-3">
                  {['Vérifier l\'identité visuelle', 'Adapter les chiffres ROI', 'Préparer les objections'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-cyan-700">
                      <CheckCircle size={14} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
