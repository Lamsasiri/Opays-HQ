import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getProjects, createProject } from '../models';

const router = Router();
router.use(authMiddleware);

// GET /api/projects
router.get('/', (req: AuthRequest, res) => {
  const projects = getProjects(req.user!.id, req.user!.role_name);
  res.json({ projects });
});

// POST /api/projects
router.post('/', requireRole('admin', 'ceo', 'coo', 'cto'), (req: AuthRequest, res) => {
  const project = createProject({ ...req.body, owner_id: req.user!.id });
  res.status(201).json({ project });
});

export default router;
