import React from 'react';

interface DocumentTemplateProps {
  title: string;
  reference: string;
  date: string;
  clientName: string;
  clientAddress?: string;
  items?: { description: string; amount: number }[];
  total?: number;
  content?: React.ReactNode;
  type: 'INVOICE' | 'CONTRACT' | 'ADMIN';
  logoSrc?: string;
  sealSrc?: string;
}

export default function DocumentTemplate({ 
  title, 
  reference, 
  date, 
  clientName, 
  clientAddress, 
  items, 
  total,
  content,
  type,
  logoSrc = '/icon-logo.png',
  sealSrc = '/sceau-admin-opays.png'
}: DocumentTemplateProps) {
  return (
    <div className="mx-auto flex min-h-[1100px] max-w-[800px] flex-col border border-zinc-200 bg-white p-12 font-serif text-black shadow-xl print:border-none print:shadow-none">
      {/* Header */}
      <header className="mb-10 flex items-start justify-between border-b-2 border-blue-900 pb-8">
        <div className="flex items-start gap-4">
          <img src={logoSrc} alt="Logo OPAYS TECH" className="h-14 w-14 rounded-2xl object-contain shadow-sm" />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-blue-900">OPAYS <span className="text-zinc-400">TECH</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Infrastructure & Intelligence Artificielle</p>
            <div className="mt-4 text-xs leading-relaxed font-sans text-zinc-600">
              <p>Avenue de la Justice, Gombe</p>
              <p>Kinshasa, RD Congo</p>
              <p>contact@opays.tech | +243 000 000 000</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-zinc-800">{title}</h2>
          <p className="text-sm font-bold text-zinc-500 mt-1">Réf: {reference}</p>
          <p className="text-sm text-zinc-500">Date: {date}</p>
        </div>
      </header>

      {/* Client Info */}
      <section className="mb-12 flex justify-between">
        <div className="w-1/2">
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 font-sans">Destinataire</p>
          <p className="text-lg font-bold">{clientName}</p>
          <p className="text-sm text-zinc-600 mt-1 whitespace-pre-line">{clientAddress || 'Kinshasa, RDC'}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {type === 'INVOICE' && items && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-3 text-[10px] uppercase font-bold text-zinc-400 font-sans">Description des Services</th>
                <th className="py-3 text-right text-[10px] uppercase font-bold text-zinc-400 font-sans">Montant ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="py-4 text-sm font-medium">{item.description}</td>
                  <td className="py-4 text-right text-sm font-bold">{item.amount.toLocaleString()} $</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-6 text-right font-sans text-xs font-bold text-zinc-400 uppercase">Total Net à Payer</td>
                <td className="py-6 text-right text-2xl font-black text-blue-900">{total?.toLocaleString()} $</td>
              </tr>
            </tfoot>
          </table>
        )}

        {type === 'CONTRACT' && content && (
          <div className="text-sm leading-relaxed space-y-4 text-justify">
            {content}
          </div>
        )}

        {type === 'ADMIN' && content && (
          <div className="text-sm leading-relaxed space-y-4">
            {content}
          </div>
        )}
      </main>

      {/* Footer & Seal */}
      <footer className="relative mt-20 border-t pt-10">
        <div className="flex items-end justify-between">
          <div className="text-[10px] font-sans leading-relaxed text-zinc-400">
            <p>OPAYS TECH S.A.R.L - RCCM: KIN/CD/00-X-0000</p>
            <p>Identification Nationale: 00-000-X00000X</p>
            <p>www.opays.tech</p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold uppercase text-zinc-400 font-sans">Validation Officielle</p>
            <div className="w-32 h-32 relative mx-auto opacity-90">
              <img 
                src={sealSrc} 
                alt="Sceau Officiel OPAYS" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] font-bold text-zinc-600 mt-2">La Direction Générale</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
