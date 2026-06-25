import { createFileRoute } from '@tanstack/react-router';
import { ListTodo } from 'lucide-react';

export const Route = createFileRoute('/app/tasks')({
  component: TasksPage,
});

function TasksPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tâches</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Gérez vos tâches et leur progression
        </p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <ListTodo size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3, color: 'var(--muted-foreground)' }} />
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Module Tâches — à venir (Phase 3)
        </p>
      </div>
    </div>
  );
}
