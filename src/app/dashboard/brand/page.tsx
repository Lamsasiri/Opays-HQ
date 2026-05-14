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
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import DocumentReaderModal from '@/components/DocumentReaderModal';
import NewAssetModal from '@/components/modals/NewAssetModal';
import AICreativeAgent from '@/components/AICreativeAgent';
import { useProfile } from '@/lib/ProfileProvider';

export default function BrandPage() {
  const { isManager } = useProfile();
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
      
      <div className="relative z-10 mx-auto max-w-[1600px] space-y-10">
        <header className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-600 shadow-sm">
              <Sparkles size={14} className="animate-pulse" /> Creative Sovereign Space
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-7xl uppercase tracking-tighter">Brand <span className="text-pink-600">Assets</span></h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 font-medium">
                Maintenez l'excellence visuelle d'Opays Tech. Accédez aux ressources, aux templates et aux guidelines pour une identité forte et cohérente.
              </p>
            </div>
          </div>
          {isManager && (
            <button
              onClick={() => setModalOpen(true)}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-black hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Plus size={18} /> Ajouter un Support
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[450px_1fr]">
          <aside className="space-y-10">
            <div className="relative overflow-hidden rounded-[3.5rem] border border-slate-900 bg-slate-900 p-12 text-white shadow-2xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/20 blur-[80px]" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[80px]" />
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Identité <br/>Visuelle</h2>
                  <div className="h-1 w-12 bg-pink-600 rounded-full" />
                </div>
                
                <p className="text-sm leading-relaxed text-slate-300 font-medium text-justify opacity-80">
                  Notre marque incarne la fusion entre la précision algorithmique et l'audace stratégique. Chaque asset doit respirer la souveraineté technique.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accent Colors</p>
                    <div className="flex -space-x-2">
                      {['#EC4899', '#6366F1', '#0F172A'].map((color, i) => (
                        <div 
                          key={i} 
                          className="h-12 w-12 rounded-2xl border-2 border-slate-900 shadow-xl" 
                          style={{ backgroundColor: color, zIndex: 3 - i }} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Main Typeface</p>
                    <p className="text-3xl font-black uppercase tracking-tighter text-white">Outfit</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Download Brand Kit (ZIP)
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] border border-slate-200 bg-white p-10 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-slate-50">
                <Palette size={80} />
              </div>
              <h3 className="relative z-10 text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 mb-8">Creative Toolbox</h3>
              <div className="relative z-10 grid grid-cols-1 gap-4">
                {[
                  { label: 'Color Contrast Checker', icon: <Palette size={16} />, desc: 'Vérifier l\'accessibilité' },
                  { label: 'Asset Auto-Resizer', icon: <ImageIcon size={16} />, desc: 'Formats RS & Web' },
                  { label: 'AI Image Generator', icon: <Sparkles size={16} />, desc: 'DALL-E 3 Intégré' },
                ].map((tool, i) => (
                  <button 
                    key={i} 
                    className="flex items-center gap-5 rounded-[2rem] border border-slate-50 bg-slate-50/50 p-6 text-left transition-all hover:bg-white hover:border-pink-200 hover:shadow-lg group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 group-hover:text-pink-600 group-hover:border-pink-100 transition-all shadow-sm">
                      {tool.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{tool.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{tool.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <AICreativeAgent />
          </aside>

          <div className="space-y-10">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="flex w-full overflow-x-auto rounded-[2rem] border border-slate-200 bg-white p-2 shadow-sm lg:w-auto">
                {['ALL', 'BRAND', 'SALES', 'VISION', 'COMM'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tous les Assets' : cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filtrer la bibliothèque..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-5 pl-16 pr-8 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-50/50 font-medium shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] rounded-[3rem] bg-white border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200 mb-8 border border-slate-100 shadow-inner">
                  <ImageIcon size={40} />
                </div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-[0.2em]">Bibliothèque vide</p>
                <p className="mt-3 text-sm text-slate-400 font-medium italic">Commencez par uploader vos premiers supports créatifs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => openAsset(asset)}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/5 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                      {asset.url?.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i) ? (
                        <img src={asset.url} alt={asset.title} className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText size={64} className="text-slate-100 group-hover:text-pink-100 transition-colors" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 z-20">
                         <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/20">
                          {asset.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">{asset.title}</h3>
                      <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prêt pour diffusion</span>
                        </div>
                        <div className="flex gap-2">
                          {isManager && (
                            <button
                              onClick={(e) => handleDelete(asset.id, e)}
                              className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-slate-400 transition hover:bg-red-50 hover:text-red-600 hover:border-red-100 shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
