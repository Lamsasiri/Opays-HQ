"use client";

import React, { useState } from 'react';
import { Target, Zap, TrendingDown, DollarSign, ArrowRight, RotateCcw, Calculator, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function StudioPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    companyName: '',
    niche: '',
    salaryMonthly: 2500, // Salaire de base
    employerLoadPercent: 35, // Charges
    hoursLostWeekly: 10,
    productiveHoursMonthly: 140, // Heures réelles
    dealValue: 5000,
    dealsLostMonthly: 1,
    errorCostMonthly: 500, // Coût des erreurs
    opaysMonthlyCost: 600, // Maintenance
    implementationCost: 5000, // Setup
    confidencePercent: 80 // Marge de sécurité
  });

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
    const paybackMonths = data.implementationCost / (netAnnualGain / 12);
    const roiMultiple = (netAnnualGain * 3) / data.implementationCost;
    
    return {
      loadedSalaryMonthly,
      hourlyRate,
      directLaborCostAnnual,
      opportunityCostAnnual,
      errorCostAnnual,
      totalLeak: bruteLeak,
      confidenceAdjustedLeak,
      opaysAnnualCost,
      netAnnualGain,
      paybackMonths,
      roiMultiple
    };
  };

  const results = calculateROI();

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
          <Calculator size={12} /> OPAYS STUDIO
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Calculateur de Gains (ROI)</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Découvrez combien d'argent votre entreprise perd chaque année à cause des tâches manuelles et comment l'automatisation peut corriger cela.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 space-y-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
                <h2 className="text-xl font-bold text-gray-900">À propos de vous</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom de votre entreprise</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ma Société Immo"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-gray-900"
                    value={data.companyName}
                    onChange={(e) => setData({...data, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Votre secteur d'activité</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Immobilier, Commerce, etc."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-gray-900"
                    value={data.niche}
                    onChange={(e) => setData({...data, niche: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Passer à l'étape suivante <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
                <h2 className="text-xl font-bold text-gray-900">Le coût de vos équipes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Salaire Brut Mensuel ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                    value={data.salaryMonthly}
                    onChange={(e) => setData({...data, salaryMonthly: Number(e.target.value)})}
                  />
                  <p className="text-[10px] text-gray-400 italic">Combien coûte l'employé qui fait ces tâches.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heures perdues par semaine</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                    value={data.hoursLostWeekly}
                    onChange={(e) => setData({...data, hoursLostWeekly: Number(e.target.value)})}
                  />
                  <p className="text-[10px] text-gray-400 italic">Temps passé sur des tâches manuelles répétitives.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Retour
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                >
                  Continuer <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
                <h2 className="text-xl font-bold text-gray-900">Manque à gagner et Erreurs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valeur d'un contrat moyen ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                    value={data.dealValue}
                    onChange={(e) => setData({...data, dealValue: Number(e.target.value)})}
                  />
                  <p className="text-[10px] text-gray-400 italic">Combien vous rapporte un client en moyenne.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clients perdus par mois</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-gray-900"
                    value={data.dealsLostMonthly}
                    onChange={(e) => setData({...data, dealsLostMonthly: Number(e.target.value)})}
                  />
                  <p className="text-[10px] text-gray-400 italic">À cause d'un manque de réactivité ou d'organisation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Retour
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                >
                  Terminer et voir les résultats <CheckCircle size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <DollarSign size={120} />
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Pertes Annuelles Estimées</p>
            <h2 className="text-5xl font-black text-white">
              {Math.round(results.totalLeak).toLocaleString()} $
            </h2>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2"><Clock size={16} /> Temps gaspillé</span>
              <span className="font-bold text-red-400">-{Math.round(results.directLaborCostAnnual).toLocaleString()} $</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2"><AlertTriangle size={16} /> Opportunités manquées</span>
              <span className="font-bold text-red-400">-{Math.round(results.opportunityCostAnnual).toLocaleString()} $</span>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Zap size={18} /> Votre gain net potentiel</h3>
            <p className="text-3xl font-black">{Math.round(results.netAnnualGain).toLocaleString()} $ / an</p>
            <p className="text-xs text-blue-100 leading-relaxed italic">
              "En automatisant ces processus, vous récupérez immédiatement ces revenus."
            </p>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-gray-400">Score de Rentabilité</span>
              <span className="text-xs font-bold text-green-400">EXCELLENT</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[92%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
