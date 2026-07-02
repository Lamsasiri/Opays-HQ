import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../auth';
import { getArticles, createArticle } from '../models';
import { createArticleSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/knowledge — filtré par rôle côté serveur.
router.get('/', (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const articles = getArticles(req.user!.role_name);
  res.json({ articles, page, limit });
});

// POST /api/knowledge
router.post('/', (req: AuthRequest, res) => {
  const result = createArticleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const article = createArticle({ ...result.data, author_id: req.user!.id });
  res.status(201).json({ article });
});

export default router;