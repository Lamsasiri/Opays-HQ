import type { RoleName, Resource } from '@/types/database';

/**
 * Matrice RBAC — qui peut faire quoi.
 * key = resource, value = array of role names allowed.
 */
const PERMISSIONS: Record<Resource, RoleName[]> = {
  'profiles.all': ['admin', 'ceo', 'coo'],
  'profiles.self': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'projects.create': ['admin', 'ceo', 'coo', 'cto'],
  'projects.all': ['admin', 'ceo', 'coo', 'cto'],
  'projects.assigned': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'tasks.create': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer'],
  'tasks.all': ['admin', 'ceo', 'coo', 'cto'],
  'tasks.assigned': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'treasury': ['admin', 'ceo', 'coo'],
  'rh.all': ['admin', 'ceo', 'coo'],
  'rh.self': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'equity.all': ['admin', 'ceo', 'coo'],
  'equity.self': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer'],
  'knowledge.create': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer'],
  'knowledge.targeted': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'agents.config': ['admin', 'ceo', 'coo'],
  'agents.use': ['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'],
  'admin.users': ['admin', 'ceo', 'coo'],
  'admin.invitations': ['admin', 'ceo', 'coo'],
};

/**
 * Vérifie si un rôle a accès à une ressource.
 */
export function can(roleName: RoleName | null | undefined, resource: Resource): boolean {
  if (!roleName) return false;
  const allowed = PERMISSIONS[resource];
  if (!allowed) return false;
  return allowed.includes(roleName);
}

/**
 * Vérifie si un utilisateur peut voir un profil spécifique.
 */
export function canViewProfile(
  roleName: RoleName | null | undefined,
  profileId: string,
  currentUserId: string,
): boolean {
  if (!roleName) return false;
  if (can(roleName, 'profiles.all')) return true;
  if (profileId === currentUserId && can(roleName, 'profiles.self')) return true;
  return false;
}

/**
 * Vérifie si un utilisateur peut voir une tâche spécifique.
 */
export function canViewTask(
  roleName: RoleName | null | undefined,
  taskAssigneeId: string | null,
  taskCreatorId: string | null,
  currentUserId: string,
): boolean {
  if (!roleName) return false;
  if (can(roleName, 'tasks.all')) return true;
  if (
    can(roleName, 'tasks.assigned') &&
    (taskAssigneeId === currentUserId || taskCreatorId === currentUserId)
  ) {
    return true;
  }
  return false;
}

/**
 * Vérifie si un utilisateur peut voir un projet spécifique.
 */
export function canViewProject(
  roleName: RoleName | null | undefined,
  projectOwnerId: string | null,
  currentUserId: string,
): boolean {
  if (!roleName) return false;
  if (can(roleName, 'projects.all')) return true;
  if (can(roleName, 'projects.assigned') && projectOwnerId === currentUserId) return true;
  return false;
}

/**
 * Vérifie si un utilisateur peut voir un log d'equity.
 */
export function canViewEquity(
  roleName: RoleName | null | undefined,
  equityProfileId: string,
  currentUserId: string,
): boolean {
  if (!roleName) return false;
  if (can(roleName, 'equity.all')) return true;
  if (equityProfileId === currentUserId && can(roleName, 'equity.self')) return true;
  return false;
}

/**
 * Vérifie si un utilisateur peut voir un dossier RH.
 */
export function canViewRH(
  roleName: RoleName | null | undefined,
  targetProfileId: string,
  currentUserId: string,
): boolean {
  if (!roleName) return false;
  if (can(roleName, 'rh.all')) return true;
  if (targetProfileId === currentUserId && can(roleName, 'rh.self')) return true;
  return false;
}
