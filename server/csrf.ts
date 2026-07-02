/**
 * Middleware CSRF par double-submit cookie.
 *
 * Fonctionnement :
 * 1. Login pose un cookie `csrf-token` (accessible JS, SameSite=Strict)
 * 2. Le client lit ce cookie et l'envoie comme header `X-CSRF-Token`
 * 3. Ce middleware compare le cookie et le header sur chaque mutation
 *
 * Avantage : aucun état côté serveur, compatible SPA, pas de session nécessaire.
 */

import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const CSRF_COOKIE = 'csrf-token';
const CSRF_HEADER = 'x-csrf-token';

/** Durée de vie du cookie CSRF : 24h */
const CSRF_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Routes mutantes qui nécessitent une protection CSRF */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Pose un cookie CSRF (appelé après login/setSessionCookie).
 */
export function setCsrfCookie(res: Response, isProduction: boolean): string {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,    // accessible par JS client
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    maxAge: CSRF_MAX_AGE_MS,
  });
  return token;
}

/**
 * Efface le cookie CSRF (appelé après logout/clearSessionCookie).
 */
export function clearCsrfCookie(res: Response, isProduction: boolean): void {
  res.clearCookie(CSRF_COOKIE, {
    httpOnly: false,
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
  });
}

/**
 * Middleware Express : valide le token CSRF sur les mutations.
 * Ignore GET/HEAD/OPTIONS.
 */
export function csrfMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: 'CSRF token invalide ou manquant' });
    return;
  }

  next();
}