import { createFileRoute } from '@tanstack/react-router';
import { FolderKanban } from 'lucide-react';

export const Route = createFileRoute('/app/projects')({
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Projets</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Suivez l'avancement de vos projets
        </p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <FolderKanban size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3, color: 'var(--muted-foreground)' }} />
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Module Projets — à venir (Phase 3)
        </p>
      </div>
    </div>
  );
}
