import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getDb } from '../db';
import { updateSiteContentSchema } from '../validation';

const router = Router();
router.use(authMiddleware);

// Réservé à la direction
const EDITOR_ROLES = ['admin', 'ceo', 'coo', 'cto'] as const;
router.use(requireRole(...EDITOR_ROLES));

// GET /api/site-content — liste tout le contenu
router.get('/', (_req: AuthRequest, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM site_content ORDER BY section, field').all();
  res.json({ content: rows });
});

// GET /api/site-content/:section — contenu d'une section
router.get('/:section', (req: AuthRequest, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM site_content WHERE section = ? ORDER BY field').all(req.params.section);
  res.json({ section: req.params.section, content: rows });
});

// PUT /api/site-content/:section/:field — mettre à jour un champ
router.put('/:section/:field', (req: AuthRequest, res) => {
  const db = getDb();
  const parsed = updateSiteContentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  db.prepare(`
    INSERT INTO site_content (section, field, content, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(section, field) DO UPDATE SET
      content = excluded.content,
      updated_at = datetime('now')
  `).run(req.params.section, req.params.field, parsed.data.content);

  const updated = db.prepare('SELECT * FROM site_content WHERE section = ? AND field = ?').get(
    req.params.section, req.params.field
  );
  res.json({ content: updated });
});

// PUT /api/site-content/bulk — mettre à jour plusieurs champs d'un coup
router.put('/bulk', (req: AuthRequest, res) => {
  const db = getDb();
  const { entries } = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: 'Le tableau entries est requis et doit contenir au moins un élément' });
  }

  const upsert = db.prepare(`
    INSERT INTO site_content (section, field, content, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(section, field) DO UPDATE SET
      content = excluded.content,
      updated_at = datetime('now')
  `);

  const transaction = db.transaction(() => {
    for (const entry of entries) {
      if (!entry.section || !entry.field || entry.content === undefined) {
        throw new Error('Entrée invalide : section, field et content sont requis');
      }
      upsert.run(entry.section, entry.field, String(entry.content));
    }
  });

  try {
    transaction();
    res.json({ ok: true, count: entries.length });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Erreur lors de la mise à jour' });
  }
});

export default router;
