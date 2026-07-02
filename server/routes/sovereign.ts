import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getSovereignResearch, createSovereignResearch } from '../models';
import { createSovereignResearchSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/sovereign — lecture pour tous les utilisateurs authentifiés.
router.get('/', (_req: AuthRequest, res) => {
  const { limit, offset } = parsePagination(_req.query as Record<string, unknown>);
  res.json({ research: getSovereignResearch(limit, offset) });
});

// POST /api/sovereign — écriture réservée à CEO / CTO.
router.post('/', requireRole('ceo', 'cto'), (req: AuthRequest, res) => {
  const parsed = createSovereignResearchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  const research = createSovereignResearch({ ...parsed.data, author_id: req.user!.id });
  res.status(201).json({ research });
});

export default router;
