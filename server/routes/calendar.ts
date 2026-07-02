import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '../models';
import { createEventSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

const WRITE_ROLES = ['admin', 'ceo', 'coo', 'cto'] as const;

// GET /api/calendar — tous les utilisateurs authentifiés (lecture).
router.get('/', (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const events = getCalendarEvents();
  res.json({ events, page, limit });
});

// POST /api/calendar — managers uniquement.
router.post('/', requireRole(...WRITE_ROLES), (req: AuthRequest, res) => {
  const result = createEventSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const event = createCalendarEvent({ ...result.data, created_by: req.user!.id });
  res.status(201).json({ event });
});

// DELETE /api/calendar/:id — managers uniquement.
router.delete('/:id', requireRole(...WRITE_ROLES), (req: AuthRequest, res) => {
  if (!deleteCalendarEvent(req.params.id)) return res.status(404).json({ error: 'Événement introuvable' });
  res.json({ ok: true });
});

export default router;