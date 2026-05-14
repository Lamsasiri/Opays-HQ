export type DashboardRole = 'CEO' | 'COO' | 'CTO' | 'SALES' | 'INVESTOR' | 'ENGINEER' | 'ADMIN';
export type ProfileType = 'ASSOCIATE' | 'EMPLOYEE';

export interface RbacProfile {
  id?: string | null;
  email?: string | null;
  role?: DashboardRole | string | null;
  type?: ProfileType | string | null;
  is_admin?: boolean | null;
  permissions?: Record<string, boolean> | null;
}

const DEFAULT_OPEN_ROUTES = new Set([
  '/dashboard',
  '/dashboard/profile',
]);

export const FENELON_EMAIL = 'lamsasfenelon@gmail.com';

export const MODULE_IDS = [
  'ai',
  'projects',
  'tasks',
  'knowledge',
  'ideas',
  'calendar',
  'brand',
  'preview',
  'audit',
  'treasury',
  'equity',
  'leads',
  'studio',
  'coordination',
  'contracts',
  'documents',
  'hr',
  'labs',
  'workspace',
  'settings',
  'admin',
  'job-descriptions',
] as const;

export const MODULE_RULES: Record<string, DashboardRole[]> = Object.fromEntries(
  MODULE_IDS.map((moduleId) => [moduleId, []])
) as Record<string, DashboardRole[]>;

export function normalizePermissions(permissions: RbacProfile['permissions']) {
  return permissions && typeof permissions === 'object' ? permissions : {};
}

export function isRbacAdmin(profile: RbacProfile | null | undefined) {
  if (!profile) return false;

  return profile.is_admin === true && profile.email?.toLowerCase() === FENELON_EMAIL;
}

export function getModuleIdFromPathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  const segments = normalized.split('/').filter(Boolean);

  if (segments[0] !== 'dashboard') return null;
  if (segments.length < 2) return null;

  const moduleId = segments[1];
  return moduleId;
}

export function isDashboardOpenRoute(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/login') return true;
  if (normalized === '/dashboard') return true;

  return [...DEFAULT_OPEN_ROUTES].some((route) => {
    if (route === '/dashboard') return false;
    return normalized === route || normalized.startsWith(`${route}/`);
  });
}

export function canAccessModule(profile: RbacProfile | null | undefined, moduleId: string) {
  if (!profile) return false;

  const isAdmin = isRbacAdmin(profile);
  const permissions = normalizePermissions(profile.permissions);

  if (isAdmin) return true;
  if (moduleId === 'job-descriptions') return false;
  if (permissions[moduleId] === true) return true;
  return false;
}

export function canGrantModulePermission(
  actor: RbacProfile | null | undefined,
  target: RbacProfile | null | undefined,
  moduleId: string
) {
  if (!actor || !target) return false;
  if (moduleId === 'job-descriptions') return false;

  return isRbacAdmin(actor);
}

export function sanitizeGrantedPermissions(
  actor: RbacProfile | null | undefined,
  target: RbacProfile | null | undefined,
  nextPermissions: Record<string, boolean>
) {
  return Object.fromEntries(
    Object.entries(nextPermissions).filter(([moduleId]) =>
      canGrantModulePermission(actor, target, moduleId)
    )
  );
}

export function canAccessPath(profile: RbacProfile | null | undefined, pathname: string) {
  if (isDashboardOpenRoute(pathname)) return true;

  const moduleId = getModuleIdFromPathname(pathname);
  if (!moduleId) return true;

  return canAccessModule(profile, moduleId);
}

export const ROUTE_ACCESS_MAP = MODULE_RULES;
