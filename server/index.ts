import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import treasuryRoutes from './routes/treasury';
import userRoutes from './routes/users';
import knowledgeRoutes from './routes/knowledge';
import dashboardRoutes from './routes/dashboard';
import { seedDefaultUsers } from './seed';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Seed default users on startup
seedDefaultUsers();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/treasury', treasuryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
// Catch-all for SPA routing — must be after API routes
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Opays HQ API running on port ${PORT}`);
});
