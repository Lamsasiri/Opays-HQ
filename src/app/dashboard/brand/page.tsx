"use client";

import React, { useState } from 'react';
import { Palette, Image as ImageIcon, FileText, Download, Plus, Search, ExternalLink, Globe } from 'lucide-react';

export default function BrandPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const assets = [
    { title: 'Logo Opays Tech (Primary)', type: 'IMAGE', category: 'BRAND', url: '#' },
    { title: 'Plaquette Commerciale v2', type: 'PDF', category: 'SALES', url: '#' },
    { title: 'Présentation Vision CEO', type: 'SLIDE', category: 'VISION', url: '#' },
    { title: 'Template E-mail Clients', type: 'DOC', category: 'COMM', url: '#' },
    { title: 'Charte Graphique Officielle', type: 'PDF', category: 'BRAND', url: '#' },
    { title: 'Photos Descente Terrain #01', type: 'IMAGE', category: 'COMM', url: '#' },
  ];

  const filteredAssets = activeCategory === 'ALL' ? assets : assets.filter(a => a.category === activeCategory);

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-pink-600 mb-2">
            <Palette size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Brand & Communication</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bibliothèque d'Assets</h1>
          <p className="text-gray-500 mt-1">Tout ce dont Zaina a besoin pour faire rayonner Opays Tech.</p>
        </div>
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg">
          <Plus size={18} /> Ajouter un Asset
        </button>
      </header>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto w-full md:w-auto">
          {['ALL', 'BRAND', 'SALES', 'VISION', 'COMM'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {cat === 'ALL' ? 'Tous' : cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un fichier..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:border-pink-500 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Grille d'Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden group hover:border-pink-200 transition-all shadow-sm flex flex-col">
            <div className="aspect-video bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
              {asset.type === 'IMAGE' ? <ImageIcon size={32} className="text-gray-300 group-hover:text-pink-300" /> : <FileText size={32} className="text-gray-300 group-hover:text-pink-300" />}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest mb-1">{asset.category}</span>
              <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-2">{asset.title}</h3>
              <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{asset.type}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-gray-200">
                    <Download size={14} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-gray-200">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Comm Stratégique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-pink-600 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-pink-600/20">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Globe size={120} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Vision Communication</h2>
          <p className="text-pink-100 leading-relaxed mb-8 max-w-md">
            Zaina, votre rôle est de traduire les prouesses techniques d'Evans et les idées de recherche du DG en histoires impactantes pour les chefs d'entreprise.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Cible de la semaine</p>
              <p className="text-lg font-bold">LinkedIn DRC</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Tone of Voice</p>
              <p className="text-lg font-bold">Expert & Souverain</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto">
            <ImageIcon size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prêt pour le Shooting ?</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
              Chaque descente terrain est une opportunité de capturer du contenu réel pour nos réseaux.
            </p>
          </div>
          <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-800 transition-all w-fit mx-auto">
            Ouvrir les Guidelines Brand
          </button>
        </div>
      </div>
    </div>
  );
}
