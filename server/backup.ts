/**
 * Backup automatisé de la base SQLite.
 *
 * Utilise VACUUM INTO pour une copie atomique et cohérente (SQLite ≥3.27.0).
 * Les backups sont conservés sous DATA_DIR/backups/ avec rotation.
 */

import path from 'path';
import fs from 'fs';
import { getDb } from './db';

const BACKUP_RETENTION_DAYS = 30;

function resolveDataDir(): string {
  const dataDir = process.env.DATA_DIR?.trim();
  return dataDir && dataDir.length > 0 ? dataDir : '/app/data';
}

function backupDir(): string {
  return path.join(resolveDataDir(), 'backups');
}

/**
 * Reste de place disque libre nécessaire (50 Mo) pour éviter un crash
 * si le disque est plein pendant le backup.
 */
const MIN_FREE_BYTES = 50 * 1024 * 1024;

function getFreeSpace(dir: string): number {
  try {
    const stats = fs.statfsSync(dir);
    // bsize * bavail = bytes available to non-root users
    return Number(stats.bsize) * Number(stats.bavail);
  } catch {
    return Infinity; // don't block on platforms without statfs
  }
}

/** Nettoie les backups plus vieux que BACKUP_RETENTION_DAYS. */
function rotateOldBackups(): void {
  const dir = backupDir();
  if (!fs.existsSync(dir)) return;
  const cutoff = Date.now() - BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  for (const entry of fs.readdirSync(dir)) {
    const filePath = path.join(dir, entry);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile() && stat.mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // ignore — race condition ou fichier supprimé entre-temps
    }
  }
}

/**
 * Exécute un backup atomique de la base SQLite.
 * Retourne le chemin du fichier de backup ou null en cas d'échec.
 */
export function runBackup(): string | null {
  const db = getDb();
  const dir = backupDir();

  // Vérifie l'espace disque avant de commencer
  if (getFreeSpace(dir) < MIN_FREE_BYTES) {
    console.error('[backup] Espace disque insuffisant pour le backup');
    return null;
  }

  // Crée le répertoire de backup
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error('[backup] Impossible de créer le répertoire de backup:', err);
    return null;
  }

  // Rotation des anciens backups avant d'écrire
  try {
    rotateOldBackups();
  } catch (err) {
    console.warn('[backup] Erreur lors de la rotation:', err);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(dir, `opays-hq-backup-${timestamp}.db`);

  try {
    // VACUUM INTO crée une copie atomique cohérente au point d'exécution
    db.exec(`VACUUM INTO '${backupPath.replace(/'/g, "''")}'`);

    // Vérifie que le fichier a bien été créé et fait au moins 1 Ko
    const stat = fs.statSync(backupPath);
    if (stat.size < 1024) {
      fs.unlinkSync(backupPath);
      console.error('[backup] Fichier de backup trop petit, supprimé');
      return null;
    }

    console.log(`[backup] Backup créé : ${backupPath} (${(stat.size / 1024 / 1024).toFixed(1)} Mo)`);
    return backupPath;
  } catch (err) {
    console.error('[backup] Échec du VACUUM INTO:', err);
    // Nettoie un fichier partiel si la base était en écriture
    try { if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath); } catch { /* ignore */ }
    return null;
  }
}

/**
 * Route de backup — déclenche un backup manuel.
 * Accessible aux rôles admin/ceo/cto.
 */
import { Router } from 'express';
import { authMiddleware, requireRole, AuthRequest } from './auth';

export function createBackupRouter(): Router {
  const router = Router();
  router.use(authMiddleware);

  router.post('/backup', requireRole('admin', 'ceo', 'cto'), (req: AuthRequest, res) => {
    const backupPath = runBackup();
    if (!backupPath) {
      return res.status(500).json({ error: 'Échec du backup' });
    }
    res.json({ ok: true, path: backupPath });
  });

  router.get('/backups', requireRole('admin', 'ceo', 'cto'), (req: AuthRequest, res) => {
    const dir = backupDir();
    if (!fs.existsSync(dir)) return res.json({ backups: [] });

    const backups = fs.readdirSync(dir)
      .filter(f => f.endsWith('.db'))
      .map(f => {
        const stat = fs.statSync(path.join(dir, f));
        return {
          filename: f,
          size: stat.size,
          created_at: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    res.json({ backups });
  });

  return router;
}