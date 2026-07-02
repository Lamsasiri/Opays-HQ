import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getJobDescriptions, createJobDescription, deleteJobDescription } from '../models';
import { createJobDescriptionSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);
// Fiches de poste : strictement CEO / CTO.
router.use(requireRole('ceo', 'cto'));

router.get('/', (_req: AuthRequest, res) => {
  const { limit, offset } = parsePagination(_req.query as Record<string, unknown>);
  res.json({ jobDescriptions: getJobDescriptions(limit, offset) });
});

router.post('/', (req: AuthRequest, res) => {
  const parsed = createJobDescriptionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  const jd = createJobDescription(parsed.data);
  res.status(201).json({ jobDescription: jd });
});

router.delete('/:id', (req: AuthRequest, res) => {
  if (!deleteJobDescription(req.params.id)) return res.status(404).json({ error: 'Fiche introuvable' });
  res.json({ ok: true });
});

export default router;
