"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
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
    className={`p-6 rounded-3xl border text-left transition-all group ${active ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20 text-white' : 'bg-white border-gray-100 hover:border-blue-200 text-gray-900'}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${active ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
      {icon}
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className={`text-xs leading-relaxed ${active ? 'text-blue-100' : 'text-gray-500'}`}>{description}</p>
  </button>
);

export default function StudioPage() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('roi');
  const [step, setStep] = useState(1);
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

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* 🧭 Purpose Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Presentation size={140} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-4">
            <Target size={12} /> Hub Marketing & Ventes
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Outils de Croissance Studio</h1>
          <p className="text-blue-50/80 leading-relaxed text-sm">
            Bienvenue dans votre <strong>espace de vente</strong>. Utilisez ces outils pour convaincre vos clients, générer des analyses de rentabilité (ROI) et accéder aux ressources de présentation officielles d'OPAYS TECH.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Générateur de Devis" 
          description="Créez des estimations rapides pour vos solutions IA."
          icon={<Briefcase size={24} />}
          active={activeTool === 'quotes'}
          onClick={() => setActiveTool('quotes')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTool === 'roi' ? (
          <>
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 space-y-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Calculator className="text-blue-600" size={24} /> Simulateur de Rentabilité
                </h2>
                <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`w-8 h-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entreprise Prospect</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Entreprise X"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.companyName}
                        onChange={(e) => setData({...data, companyName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secteur</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Logistique"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.niche}
                        onChange={(e) => setData({...data, niche: e.target.value})}
                      />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all uppercase text-xs tracking-widest">
                    Suivant <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Salaire Brut ($)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.salaryMonthly}
                        onChange={(e) => setData({...data, salaryMonthly: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heures Perdues / Sem.</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.hoursLostWeekly}
                        onChange={(e) => setData({...data, hoursLostWeekly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 uppercase text-xs tracking-widest">Retour</button>
                    <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 uppercase text-xs tracking-widest">Continuer <ArrowRight size={16} /></button>
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
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valeur Contrat Moyen ($)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.dealValue}
                        onChange={(e) => setData({...data, dealValue: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Leads Perdus / Mois</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                        value={data.dealsLostMonthly}
                        onChange={(e) => setData({...data, dealsLostMonthly: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 uppercase text-xs tracking-widest">Retour</button>
                    <button 
                      onClick={handleSave} 
                      disabled={loading}
                      className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer la Simulation'} <CheckCircle size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <DollarSign size={120} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Rapport de Fuite de Capitaux</p>
              <h2 className="text-5xl font-black text-white">{Math.round(results.totalLeak).toLocaleString()} $ / an</h2>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Clock size={16} /> Main d'œuvre gaspillée</span>
                  <span className="font-bold text-red-400">-{Math.round(results.directLaborCostAnnual).toLocaleString()} $</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><AlertTriangle size={16} /> Opportunités manquées</span>
                  <span className="font-bold text-red-400">-{Math.round(results.opportunityCostAnnual).toLocaleString()} $</span>
                </div>
              </div>
              <div className="bg-blue-600 rounded-2xl p-6">
                <h3 className="font-bold flex items-center gap-2 text-sm"><Zap size={16} /> Gain net potentiel</h3>
                <p className="text-3xl font-black mt-2">{Math.round(results.netAnnualGain).toLocaleString()} $</p>
                <button className="w-full mt-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <Download size={14} /> Télécharger PDF
                </button>
              </div>
            </div>

            {/* Previous Simulations List */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-gray-400" /> Historique des Simulations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simulations.map((sim) => (
                  <div key={sim.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{sim.company_name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{sim.sector}</p>
                      </div>
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-bold rounded-md">
                        +{Math.round(sim.net_gain_annual).toLocaleString()} $
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">{new Date(sim.created_at).toLocaleDateString()}</span>
                      <button className="text-[10px] font-bold text-blue-600 hover:underline">Charger</button>
                    </div>
                  </div>
                ))}
                {simulations.length === 0 && (
                  <p className="col-span-full text-center py-10 text-gray-400 italic text-sm">Aucune simulation enregistrée.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
              <Presentation size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ressources en cours de synchronisation</h2>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Nous préparons les templates de Pitch et les Études de Cas officiels pour votre secteur. Revenez bientôt !
              </p>
            </div>
            <button 
              onClick={() => setActiveTool('roi')}
              className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all uppercase text-xs tracking-widest"
            >
              Retour au calculateur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
