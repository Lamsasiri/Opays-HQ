import { createFileRoute, redirect } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, FileEdit, Eye, EyeOff } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { apiGetSiteContent, apiUpdateSiteContentBulk } from '@/lib/api';

const EDITOR_ROLES = ['admin', 'ceo', 'coo', 'cto'];

export const Route = createFileRoute('/_app/app/site-content')({
  component: SiteContentPage,
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: '/login' });
    if (!user.role_name || !EDITOR_ROLES.includes(user.role_name)) {
      throw redirect({ to: '/app/dashboard' });
    }
  },
});

interface ContentEntry {
  id: number;
  section: string;
  field: string;
  content: string;
  updated_at: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (Accueil)',
  about: 'À propos',
  services: 'Services',
  features: 'Fonctionnalités',
  contact: 'Contact',
};

const SECTION_ORDER = ['hero', 'about', 'services', 'features', 'contact'];

function fieldLabel(section: string, field: string): string {
  const labels: Record<string, string> = {
    title: 'Titre',
    subtitle: 'Sous-titre',
    description: 'Description',
    cta: 'Bouton CTA',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
  };
  if (section === 'features') {
    if (field.endsWith('_title')) return `Fonctionnalité ${field.match(/\d+/)?.[0] || ''} — Titre`;
    if (field.endsWith('_desc')) return `Fonctionnalité ${field.match(/\d+/)?.[0] || ''} — Description`;
  }
  return labels[field] || field;
}

function isLongText(section: string, field: string): boolean {
  return field === 'description' || field.endsWith('_desc');
}

function SiteContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [contentMap, setContentMap] = useState<Record<string, Record<string, string>>>({});
  const [originalMap, setOriginalMap] = useState<Record<string, Record<string, string>>>({});
  const [preview, setPreview] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await apiGetSiteContent();
    if (err || !data) {
      toast.error('Erreur de chargement', { description: err });
      setLoading(false);
      return;
    }

    const map: Record<string, Record<string, string>> = {};
    for (const entry of data.content as ContentEntry[]) {
      if (!map[entry.section]) map[entry.section] = {};
      map[entry.section][entry.field] = entry.content;
    }
    setContentMap(map);
    setOriginalMap(JSON.parse(JSON.stringify(map)));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasChanges = (section: string): boolean => {
    const orig = originalMap[section] || {};
    const curr = contentMap[section] || {};
    return Object.keys({ ...orig, ...curr }).some(
      (key) => orig[key] !== curr[key]
    );
  };

  const anyChanges = Object.keys(contentMap).some(hasChanges);

  const handleChange = (section: string, field: string, value: string) => {
    setContentMap((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const entries: { section: string; field: string; content: string }[] = [];
    for (const section of Object.keys(contentMap)) {
      const orig = originalMap[section] || {};
      const curr = contentMap[section] || {};
      for (const field of Object.keys(curr)) {
        if (orig[field] !== curr[field]) {
          entries.push({ section, field, content: curr[field] });
        }
      }
    }

    if (entries.length === 0) {
      toast.info('Aucune modification à enregistrer');
      setSaving(false);
      return;
    }

    const { error: err } = await apiUpdateSiteContentBulk(entries);
    if (err) {
      toast.error('Erreur lors de la sauvegarde', { description: err });
    } else {
      toast.success(`✅ ${entries.length} champ${entries.length > 1 ? 's' : ''} enregistré${entries.length > 1 ? 's' : ''}`);
      setOriginalMap(JSON.parse(JSON.stringify(contentMap)));
    }
    setSaving(false);
  };

  const togglePreview = (section: string) => {
    setPreview((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Chargement du contenu…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Éditeur du site vitrine
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Modifiez le contenu affiché sur opays.io
          </p>
        </div>
        <button
          className="btn btn-primary"
          disabled={!anyChanges || saving}
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={16} />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {SECTION_ORDER.map((section) => {
          const modified = hasChanges(section);
          return (
            <button
              key={section}
              className={`btn ${activeTab === section ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(section)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              <FileEdit size={14} />
              {SECTION_LABELS[section] || section}
              {modified && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'inline-block',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content editor */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {SECTION_ORDER.map((section) => {
          if (activeTab !== section) return null;
          const fields = contentMap[section] || {};
          const fieldKeys = Object.keys(fields);
          const showPreview = preview[section];

          return (
            <div key={section}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  {SECTION_LABELS[section] || section}
                </h2>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => togglePreview(section)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPreview ? 'Masquer aperçu' : 'Aperçu'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fieldKeys.map((field) => (
                  <div key={field}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        marginBottom: '0.375rem',
                        color: 'var(--foreground)',
                      }}
                    >
                      {fieldLabel(section, field)}
                    </label>

                    {isLongText(section, field) ? (
                      <div>
                        <textarea
                          className="form-input"
                          value={fields[field]}
                          onChange={(e) => handleChange(section, field, e.target.value)}
                          rows={4}
                          style={{
                            width: '100%',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                          }}
                        />
                        {showPreview && (
                          <div
                            style={{
                              marginTop: '0.5rem',
                              padding: '0.75rem',
                              background: 'var(--muted)',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                              color: 'var(--muted-foreground)',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {fields[field] || '—'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          className="form-input"
                          type="text"
                          value={fields[field]}
                          onChange={(e) => handleChange(section, field, e.target.value)}
                          style={{
                            width: '100%',
                            fontSize: '0.875rem',
                          }}
                        />
                        {showPreview && (
                          <div
                            style={{
                              marginTop: '0.375rem',
                              padding: '0.5rem 0.75rem',
                              background: 'var(--muted)',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.875rem',
                              color: 'var(--muted-foreground)',
                            }}
                          >
                            {fields[field] || '—'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
