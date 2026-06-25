import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'opays-hq-secret-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role_name: string;
    role_label: string;
  };
}

export function generateToken(user: { id: string; email: string; role_name: string; role_label: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role_name: user.role_name, role_label: user.role_label },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role_name: decoded.role_name,
      role_label: decoded.role_label,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (!roles.includes(req.user.role_name)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  };
}
