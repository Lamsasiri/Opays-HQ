import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getTreasuryLogs, createTreasuryLog } from '../models';
import { createTreasuryLogSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/treasury
router.get('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const logs = getTreasuryLogs();
  res.json({ logs, page, limit });
});

// POST /api/treasury
router.post('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const result = createTreasuryLogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const log = createTreasuryLog({ ...result.data, created_by: req.user!.id });
  res.status(201).json({ log });
});

export default router;