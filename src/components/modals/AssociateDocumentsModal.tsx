"use client";

import React, { useState, useEffect } from 'react';
import { X, FileUp, FileText, Download, Trash2, ShieldCheck, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function AssociateDocumentsModal({ isOpen, onClose, member }: { isOpen: boolean, onClose: () => void, member: any }) {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDoc, setNewDoc] = useState({ title: '', url: '', type: 'LEGAL' });
  const supabase = createClient();

  const fetchDocs = async () => {
    if (!member?.id) return;
    const { data } = await supabase
      .from('associate_documents')
      .select('*')
      .eq('profile_id', member.id)
      .order('uploaded_at', { ascending: false });
    if (data) setDocuments(data);
  };

  useEffect(() => {
    if (isOpen && member) fetchDocs();
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('associate_documents')
      .insert([{
        profile_id: member.id,
        title: newDoc.title,
        file_url: newDoc.url,
        type: newDoc.type
      }]);

    if (!error) {
      setNewDoc({ title: '', url: '', type: 'LEGAL' });
      fetchDocs();
    }
    setLoading(false);
  };

  const deleteDoc = async (id: string) => {
    if (confirm("Supprimer ce document ?")) {
      const { error } = await supabase.from('associate_documents').delete().eq('id', id);
      if (!error) fetchDocs();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Documents de l'Associé
            </h2>
            <p className="text-xs text-gray-400 mt-1">{member.full_name} • {member.role}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          {/* Nouveau Document */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} /> Ajouter un document personnalisé
            </h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Titre du document</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Ex: Pacte d'associé signé"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</label>
                <select 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                >
                  <option value="LEGAL">Juridique / Pacte</option>
                  <option value="CONTRACT">Contrat de Prestation</option>
                  <option value="IDENTITY">Identité / KYC</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lien du fichier (Drive/Cloud)</label>
                <input 
                  required 
                  type="url" 
                  placeholder="https://..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                  value={newDoc.url}
                  onChange={(e) => setNewDoc({...newDoc, url: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="md:col-span-2 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
              >
                {loading ? 'Ajout...' : 'Publier le Document'}
              </button>
            </form>
          </div>

          {/* Liste des Documents */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documents Archivés</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${doc.type === 'LEGAL' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{doc.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                        {doc.type} • Ajouté le {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg border border-transparent hover:border-blue-100 transition-all"
                      title="Télécharger"
                    >
                      <Download size={16} />
                    </a>
                    <button 
                      onClick={() => deleteDoc(doc.id)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="py-12 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                  <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400 italic">Aucun document personnalisé pour cet associé.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-green-600 mt-0.5" />
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              Ces documents sont confidentiels et visibles uniquement par l'associé concerné et l'administration (CEO/COO). Assurez-vous de la validité des liens avant publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
