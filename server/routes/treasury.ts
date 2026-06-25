import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getTreasuryLogs, createTreasuryLog } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/treasury
router.get('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const logs = getTreasuryLogs();
  res.json({ logs });
});

// POST /api/treasury
router.post('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const log = createTreasuryLog({ ...req.body, created_by: req.user!.id });
  res.status(201).json({ log });
});

export default router;
