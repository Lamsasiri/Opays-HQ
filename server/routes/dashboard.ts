import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../auth';
import { getDashboardStats } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', (req: AuthRequest, res) => {
  const stats = getDashboardStats();
  res.json({ stats });
});

export default router;
