import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getHrRecords, upsertHrRecord } from '../models';
import { upsertHrSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/hr — fiches employés (salaire, performance). Vue gestion + paramètres.
router.get('/', requireRole('admin', 'ceo', 'coo', 'cto'), (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const records = getHrRecords();
  res.json({ records, page, limit });
});

// PUT /api/hr/:userId — met à jour salaire/performance (CEO/CTO uniquement).
router.put('/:userId', requireRole('ceo', 'cto'), (req: AuthRequest, res) => {
  const result = upsertHrSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const record = upsertHrRecord(req.params.userId, result.data);
  res.json({ record });
});

export default router;