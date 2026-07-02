import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getTasks, createTask, updateTaskStatus } from '../models';
import { createTaskSchema, updateTaskStatusSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/tasks
router.get('/', (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const tasks = getTasks(req.user!.id, req.user!.role_name);
  res.json({ tasks, page, limit });
});

// POST /api/tasks
router.post('/', requireRole('admin', 'ceo', 'coo', 'cto', 'sales', 'engineer'), (req: AuthRequest, res) => {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const task = createTask({ ...result.data, created_by: req.user!.id });
  res.status(201).json({ task });
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', (req: AuthRequest, res) => {
  const result = updateTaskStatusSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Statut invalide', details: result.error.flatten() });
  }
  const task = updateTaskStatus(req.params.id, result.data.status);
  res.json({ task });
});

export default router;