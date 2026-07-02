import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getProjects, createProject, updateProject } from '../models';
import { createProjectSchema, updateProjectSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// GET /api/projects
router.get('/', (req: AuthRequest, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const projects = getProjects(req.user!.id, req.user!.role_name, limit, offset);
  res.json({ projects, page, limit });
});

// POST /api/projects
router.post('/', requireRole('admin', 'ceo', 'coo', 'cto'), (req: AuthRequest, res) => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const project = createProject({ ...result.data, owner_id: req.user!.id });
  res.status(201).json({ project });
});

// PUT /api/projects/:id — statut, marges, feedback client (gestion).
router.put('/:id', requireRole('admin', 'ceo', 'coo', 'cto'), (req: AuthRequest, res) => {
  const result = updateProjectSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const project = updateProject(req.params.id, result.data);
  if (!project) return res.status(404).json({ error: 'Projet introuvable' });
  res.json({ project });
});

export default router;