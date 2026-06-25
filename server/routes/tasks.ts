import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getTasks, createTask, updateTaskStatus } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/tasks
router.get('/', (req: AuthRequest, res) => {
  const tasks = getTasks(req.user!.id, req.user!.role_name);
  res.json({ tasks });
});

// POST /api/tasks
router.post('/', requireRole('admin', 'ceo', 'coo', 'cto', 'sales', 'engineer'), (req: AuthRequest, res) => {
  const task = createTask({ ...req.body, created_by: req.user!.id });
  res.status(201).json({ task });
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!['todo', 'in_progress', 'review', 'done', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }
  const task = updateTaskStatus(req.params.id, status);
  res.json({ task });
});

export default router;
