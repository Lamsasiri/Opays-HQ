import './env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import treasuryRoutes from './routes/treasury';
import userRoutes from './routes/users';
import knowledgeRoutes from './routes/knowledge';
import dashboardRoutes from './routes/dashboard';
import equityRoutes from './routes/equity';
import hrRoutes from './routes/hr';
import agentRoutes from './routes/agents';
import leadsRoutes from './routes/leads';
import calendarRoutes from './routes/calendar';
import ideasRoutes from './routes/ideas';
import jobDescriptionRoutes from './routes/jobDescriptions';
import sovereignRoutes from './routes/sovereign';
import businessRoutes from './routes/business';
import vaultRoutes from './routes/vault';
import invoiceRoutes from './routes/invoices';
import marketingRoutes from './routes/marketing';
import contactRoutes from './routes/contacts';
import siteContentRoutes from './routes/site-content';
import { seedDefaultUsers, seedMarketingTemplates, seedSiteContent } from './seed';
import { loadConfigOrExit, loadAllowedOrigins } from './config';
import { getDb } from './db';
import rateLimit from 'express-rate-limit';
import { csrfMiddleware } from './csrf';
import { createBackupRouter } from './backup';

export const app = express();

// Middleware
const allowedOrigins = loadAllowedOrigins(process.env);
if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
  console.warn('[WARN] CORS_ORIGIN is empty — no cross-origin requests allowed in production');
}
app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (same-origin, server tools, curl)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Origin not allowed by CORS policy'), false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting on auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes' },
});

// CSRF protection on all mutating requests (POST/PUT/PATCH/DELETE)
// Désactivé en mode test pour ne pas casser les tests existants.
// Les routes /api/auth sont exemptées car l'utilisateur n'a pas encore de token
// avant de se connecter. Le token CSRF est posé lors du login (via setCsrfCookie).
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  app.use('/api', (req, res, next) => {
    // Exempt auth routes (login, register, google oauth) — utilisateur n'a pas encore de token
    if (req.path.startsWith('/auth/')) return next();
    csrfMiddleware(req, res, next);
  });
}

// API routes — rate limited auth first
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/treasury', treasuryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equity', equityRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/job-descriptions', jobDescriptionRoutes);
app.use('/api/sovereign', sovereignRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/site-content', siteContentRoutes);

// Backup routes (manual trigger + list)
app.use('/api/system', createBackupRouter());

// Health check — formalized contract consumed by the platform health check.
// res.json sets Content-Type: application/json and status 200 by default.
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 404 guard — must run AFTER the API routers but BEFORE the static/SPA
// fallback so unmatched /api/* requests receive a JSON 404 and never the SPA
// entry document.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Serve static frontend in production — returns matched assets with 200.
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback — only reached for non-API paths that did not match a static
// asset; returns index.html with status 200.
app.use((_req, res) => {
  res.status(200).sendFile(path.join(distPath, 'index.html'));
});

// Startup sequence (design "Startup sequence"): validate configuration and make
// storage ready BEFORE binding the port. The server must only bind
// `0.0.0.0:3001` after JWT_SECRET validation passes and the database has been
// opened/initialized. Any failure aborts startup without binding.
function start(): void {
  // 1. Fail-fast configuration validation. On invalid JWT_SECRET this logs and
  //    calls process.exit(1), so the process never reaches app.listen.
  const config = loadConfigOrExit(process.env);

  // 2. Open/initialize the database (schema + role seeding). getDb() throws on
  //    storage failure, which propagates and aborts startup before binding.
  getDb();

  // 3. Seed default users now that storage is ready.
  seedDefaultUsers();

  // 4. Seed marketing templates.
  seedMarketingTemplates();

  // 5. Seed site vitrine content.
  seedSiteContent();

  // 6. Only now is it safe to bind the port and accept traffic.
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Opays HQ API running on port ${config.port}`);
  });

  // 7. Schedule daily SQLite backup at 03:00 server time.
  scheduleDailyBackup();
}

/**
 * Planifie un backup automatique de la base SQLite chaque jour à 03:00.
 * Utilise un intervalle simple (pas de dépendance externe) : vérifie toutes
 * les 15 minutes si l'heure cible est atteinte.
 */
function scheduleDailyBackup(): void {
  const BACKUP_HOUR = 3;
  const BACKUP_MINUTE = 0;
  const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 min

  let lastBackupDate = '';

  const check = () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    // Ne pas relancer si déjà backupé aujourd'hui
    if (lastBackupDate === today) return;

    if (now.getHours() === BACKUP_HOUR && now.getMinutes() >= BACKUP_MINUTE) {
      lastBackupDate = today;
      console.log('[backup] Déclenchement du backup automatique quotidien...');
      const { runBackup } = require('./backup');
      runBackup();
    }
  };

  setInterval(check, CHECK_INTERVAL_MS);
  // Exécute aussi au démarrage si on est dans la fenêtre
  check();
}

// Run the startup side effects (config validation, DB init, port bind) only when
// this module is executed directly (e.g. `tsx server/index.ts` in production).
// When imported by a test runner (Vitest sets `process.env.VITEST`) we skip
// `start()` so the configured `app` can be imported with supertest without
// binding a port or triggering `process.exit`.
if (!process.env.VITEST) {
  start();
}

export default app;
