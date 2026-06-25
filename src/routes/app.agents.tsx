import { createFileRoute } from '@tanstack/react-router';
import { Bot } from 'lucide-react';

export const Route = createFileRoute('/app/agents')({
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Agents IA</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Vos agents intelligents dédiés par rôle
        </p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <Bot size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3, color: 'var(--muted-foreground)' }} />
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Module Agents IA — à venir (Phase 4)
        </p>
      </div>
    </div>
  );
}
