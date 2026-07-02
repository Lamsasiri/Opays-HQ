import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getContracts, createContract, getBilling } from '../models';
import { createContractSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// Rôles : lecture pour la gestion, upload pour CEO/CTO/CSO(sales).
const READ_ROLES = ['admin', 'ceo', 'coo', 'cto', 'sales'] as const;
const UPLOAD_ROLES = ['ceo', 'cto', 'sales'] as const;

// Stockage local sous DATA_DIR/vault (remplace Supabase Storage).
function vaultDir(): string {
  const dataDir = process.env.DATA_DIR?.trim() || '/app/data';
  return path.join(dataDir, 'vault');
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = vaultDir();
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/vault/upload — upload d'un document (CEO/CTO/CSO).
router.post('/upload', requireRole(...UPLOAD_ROLES), upload.single('file'), (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
  const url = `/api/vault/files/${req.file.filename}`;
  let contract = null;
  if (req.body.project_id) {
    const parsed = createContractSchema.safeParse({ url, project_id: req.body.project_id, signed_at: req.body.signed_at, version: req.body.version });
    const data = parsed.success ? parsed.data : { url, project_id: req.body.project_id };
    contract = createContract(data);
  }
  res.status(201).json({ url, contract });
});

// GET /api/vault/files/:name — sert un fichier du coffre (lecture restreinte).
router.get('/files/:name', requireRole(...READ_ROLES), (req: AuthRequest, res) => {
  const name = path.basename(req.params.name); // anti path-traversal
  const filePath = path.join(vaultDir(), name);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier introuvable' });
  res.sendFile(filePath);
});

// GET /api/vault/contracts
router.get('/contracts', requireRole(...READ_ROLES), (_req: AuthRequest, res) => {
  const { limit, offset } = parsePagination(_req.query as Record<string, unknown>);
  res.json({ contracts: getContracts(limit, offset) });
});

// GET /api/vault/billing
router.get('/billing', requireRole(...READ_ROLES), (_req: AuthRequest, res) => {
  const { limit, offset } = parsePagination(_req.query as Record<string, unknown>);
  res.json({ billing: getBilling(limit, offset) });
});

export default router;
