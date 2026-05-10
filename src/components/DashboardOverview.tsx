"use client";

import React from 'react';

// Composant de Carte Statistique pour le Dashboard
const StatCard = ({ title, value, icon, change }: { title: string, value: string, icon: any, change?: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-zinc-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        {change && <p className="text-green-500 text-xs mt-1">{change} vs mois dernier</p>}
      </div>
      <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300">
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">OPAYS HQ</h1>
          <p className="text-zinc-500 mt-2">Bienvenue sur le centre de commandement d'OPAYS TECH.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
            Nouveau Lead
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pipeline Total" value="45.000 $" icon="💰" change="+12%" />
        <StatCard title="Leads Actifs" value="12" icon="🔥" />
        <StatCard title="Audits en cours" value="4" icon="📊" />
        <StatCard title="Vesting Moyen" value="15.4 %" icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Projets Récents</h2>
          <div className="space-y-4">
            {/* Liste des projets ici */}
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div>
                <p className="font-semibold">Audit Efficience - Client Gecamines</p>
                <p className="text-sm text-zinc-500">En cours • Échéance : 15 Mai</p>
              </div>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20">En développement</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Répartition des Parts</h2>
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Fondateurs (Vesting)</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '65%' }}></div>
            </div>
            {/* Autres indicateurs */}
          </div>
        </div>
      </div>
    </div>
  );
}
