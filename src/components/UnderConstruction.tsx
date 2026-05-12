"use client";

import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UnderConstructionProps {
  title: string;
  description?: string;
  expectedDate?: string;
}

export default function UnderConstruction({ title, description, expectedDate }: UnderConstructionProps) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-center justify-center">
          <Construction size={36} className="text-amber-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            {description || "Ce module est en cours de développement. Il sera bientôt disponible dans votre espace de travail."}
          </p>
        </div>
        {expectedDate && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Livraison estimée : {expectedDate}</span>
          </div>
        )}
        <div className="pt-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={16} />
            Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
