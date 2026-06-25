import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../auth';
import { getArticles, createArticle } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/knowledge
router.get('/', (req: AuthRequest, res) => {
  const articles = getArticles();
  res.json({ articles });
});

// POST /api/knowledge
router.post('/', (req: AuthRequest, res) => {
  const article = createArticle({ ...req.body, author_id: req.user!.id });
  res.status(201).json({ article });
});

export default router;
