import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../auth';
import { getUsers, getAssignableUsers, getUserByEmail, createGoogleUser, updateUserRole, getUserById, updateUserProfile, getGoogleAccount } from '../models';
import { updateProfileSchema, inviteUserSchema, updateUserRoleSchema, parsePagination } from '../validation';

const router = Router();
router.use(authMiddleware);

// Rôles assignables (liste blanche partagée avec l'inscription).
const ASSIGNABLE_ROLES = ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'];

// GET /api/users/me — profil de l'utilisateur courant + statut de liaison Google.
router.get('/me', (req: AuthRequest, res) => {
  const user = getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  const google = getGoogleAccount(req.user!.id);
  res.json({
    user,
    google: google ? { connected: true, scopes: google.scopes, expiry_date: google.expiry_date } : { connected: false },
  });
});

// PUT /api/users/me — l'utilisateur édite son propre profil (nom, avatar).
// L'email reste en lecture seule : il sert de clé d'identité au SSO Google.
router.put('/me', (req: AuthRequest, res) => {
  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const data = result.data;
  const profile: { full_name?: string; avatar_url?: string } = {};
  if (data.full_name !== undefined) profile.full_name = data.full_name;
  if (data.avatar_url !== undefined) profile.avatar_url = data.avatar_url ?? undefined;
  const user = updateUserProfile(req.user!.id, profile);
  res.json({ user });
});

// GET /api/users — liste complète (vue RH / admin / paramètres CEO-CTO).
router.get('/', requireRole('admin', 'ceo', 'coo', 'cto'), (req: AuthRequest, res) => {
  const { page, limit } = parsePagination(req.query);
  const users = getUsers();
  res.json({ users, page, limit });
});

// GET /api/users/assignable — liste minimale pour l'assignation de tâches.
// Accessible à tout utilisateur authentifié (les créateurs de tâches en ont besoin).
router.get('/assignable', (req: AuthRequest, res) => {
  const users = getAssignableUsers();
  res.json({ users });
});

// POST /api/users — invite/pré-provisionne un membre (CEO/CTO uniquement).
// L'utilisateur se connectera ensuite via Google avec cet email et héritera du rôle.
router.post('/', requireRole('ceo', 'cto'), (req: AuthRequest, res) => {
  const result = inviteUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides', details: result.error.flatten() });
  }
  const { email, full_name, role_name } = result.data;
  if (role_name && !ASSIGNABLE_ROLES.includes(role_name)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }
  if (getUserByEmail(email)) {
    return res.status(409).json({ error: 'Cet email existe déjà' });
  }
  const user = createGoogleUser(email, full_name ?? null, null, role_name || 'employee');
  res.status(201).json({ user });
});

// PATCH /api/users/:id/role — modifie le rôle (CEO/CTO uniquement).
router.patch('/:id/role', requireRole('ceo', 'cto'), (req: AuthRequest, res) => {
  const result = updateUserRoleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Rôle invalide', details: result.error.flatten() });
  }
  const user = updateUserRole(req.params.id, result.data.role_name);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ user });
});

export default router;