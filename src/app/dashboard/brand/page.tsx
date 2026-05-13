"use client";

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  ExternalLink, 
  Globe, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import DocumentReaderModal from '@/components/DocumentReaderModal';
import NewAssetModal from '@/components/modals/NewAssetModal';
import AICreativeAgent from '@/components/AICreativeAgent';

export default function BrandPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerAsset, setReaderAsset] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('global_documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setAssets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Supprimer cet asset ?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('global_documents')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      setAssets(assets.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesCategory = activeCategory === 'ALL' || a.category === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAsset = (asset: any) => {
    const isImage = asset.url?.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i);
    setReaderAsset({
      ...asset,
      subtitle: !isImage
        ? 'Lecture centrée pour consulter le support sans distraction.'
        : 'Aperçu centré pour garder la lecture simple et claire.',
      badge: asset.category,
      sourceLabel: !isImage ? 'Document' : 'Image',
      pdfUrl: asset.url,
      content: !isImage ? null : `![${asset.title}](${asset.url})`
    });
    setReaderOpen(true);
  };

  return (
    <div className="relative min-h-full px-6 py-8 text-slate-900 lg:px-8 bg-[#f8f9fb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-600">
              <Palette size={16} /> Brand & Communication
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl uppercase">Bibliothèque d'Assets</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 font-medium">Le hub visuel d'Opays Tech pour contrôler les assets, les templates et la cohérence de marque.</p>
            </div>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-700"
          >
            <Plus size={18} /> Ajouter un Asset
          </button>
        </header>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm md:w-auto">
            {['ALL', 'BRAND', 'SALES', 'VISION', 'COMM'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? 'Tous' : cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un fichier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-50/50 font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 rounded-[2rem] bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <AlertCircle size={48} className="text-red-500 opacity-50" />
            <p className="text-slate-500 font-medium">Impossible de charger les assets : {error}</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
            <ImageIcon size={48} className="text-slate-200" />
            <p className="text-slate-500 font-medium">Aucun asset trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                onClick={() => openAsset(asset)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm transition-all hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/5"
              >
                <div className="flex aspect-video items-center justify-center bg-slate-50 transition-colors group-hover:bg-pink-50 overflow-hidden">
                  {asset.url?.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i) ? (
                    <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <FileText size={32} className="text-slate-200 transition group-hover:text-pink-300" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-pink-600">{asset.category}</span>
                  <h3 className="mb-4 text-sm font-bold text-slate-900 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-pink-600 transition-colors">{asset.title}</h3>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Document</span>
                    <div className="flex gap-2">
                      <a 
                        href={asset.url} 
                        download 
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition hover:bg-white hover:text-slate-900 hover:border-slate-200"
                      >
                        <Download size={14} />
                      </a>
                      <button 
                        onClick={(e) => handleDelete(asset.id, e)}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-pink-100 bg-gradient-to-br from-pink-600 via-fuchsia-600 to-violet-700 p-10 text-white shadow-2xl shadow-pink-600/20">
              <div className="absolute right-0 top-0 p-10 opacity-10">
                <Globe size={120} />
              </div>
              <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">Vision Brand</h2>
              <p className="mb-8 leading-7 text-pink-100 font-medium text-sm">
                Votre rôle est de traduire les prouesses techniques en histoires impactantes pour les décideurs.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Target</p>
                  <p className="text-lg font-bold">B2B DRC & Global</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Tone</p>
                  <p className="text-lg font-bold">Expert & Sovereign</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-pink-50 text-pink-600">
                <ImageIcon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Guidelines Brand</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm text-slate-500 font-medium leading-relaxed">
                  Consultez la charte pour garantir la cohérence visuelle d'Opays Tech.
                </p>
              </div>
              <button
                className="mx-auto w-fit rounded-2xl bg-slate-900 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-black shadow-xl shadow-slate-900/10"
              >
                Ouvrir les Guidelines
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AICreativeAgent />
          </div>
        </div>
      </div>

      <NewAssetModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={fetchAssets}
      />

      <DocumentReaderModal
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
        title={readerAsset?.title || 'Document'}
        subtitle={readerAsset?.subtitle}
        content={readerAsset?.content}
        pdfUrl={readerAsset?.pdfUrl}
        badge={readerAsset?.badge}
        sourceLabel={readerAsset?.sourceLabel}
      />
    </div>
  );
}
