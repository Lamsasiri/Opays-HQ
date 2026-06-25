import { Router } from 'express';
import { verifyPassword, createUser, getUserById } from '../models';
import { generateToken, authMiddleware, AuthRequest } from '../auth';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const user = verifyPassword(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = generateToken(user);
  res.json({ user, token });
});

// POST /api/auth/register (admin only — seed users)
router.post('/register', (req, res) => {
  const { email, password, full_name, role_name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const user = createUser(email, password, full_name, role_name);
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const user = getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ user });
});

export default router;
