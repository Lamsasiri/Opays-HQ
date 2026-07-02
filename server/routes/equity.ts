import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getEquityLogs, createEquityLog } from '../models';
import { createEquityLogSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/equity — logs de vesting (vue gestion).
router.get('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const logs = getEquityLogs();
  res.json({ logs, page, limit });
});

// POST /api/equity — attribue de l'equity (CEO/CTO uniquement).
router.post('/', requireRole('ceo', 'cto'), (req: AuthRequest, res) => {
  const result = createEquityLogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Champs requis manquants ou invalides', details: result.error.flatten() });
  }
  const log = createEquityLog(result.data);
  res.status(201).json({ log });
});

export default router;