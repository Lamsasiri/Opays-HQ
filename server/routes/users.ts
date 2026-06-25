import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getUsers } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/users
router.get('/', requireRole('admin', 'ceo', 'coo'), (req: AuthRequest, res) => {
  const users = getUsers();
  res.json({ users });
});

export default router;
