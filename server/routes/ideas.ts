import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../auth';
import { getIdeas, createIdea, voteIdea } from '../models';
import { createIdeaSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/ideas — toutes les idées (avec auteur).
router.get('/', (_req: AuthRequest, res) => {
  const { limit, offset } = parsePagination(_req.query as Record<string, unknown>);
  res.json({ ideas: getIdeas(limit, offset) });
});

// POST /api/ideas — toute personne authentifiée peut proposer.
router.post('/', (req: AuthRequest, res) => {
  const parsed = createIdeaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  const idea = createIdea({ ...parsed.data, profile_id: req.user!.id });
  res.status(201).json({ idea });
});

// POST /api/ideas/:id/vote — +1 vote.
router.post('/:id/vote', (req: AuthRequest, res) => {
  const idea = voteIdea(req.params.id);
  if (!idea) return res.status(404).json({ error: 'Idée introuvable' });
  res.json({ idea });
});

export default router;
