import { apiLogin, apiRegister, apiGetMe } from './api';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role_name: string | null;
  role_label: string | null;
  is_active: boolean;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const { data, error } = await apiGetMe();
  if (error || !data) {
    localStorage.removeItem('token');
    return null;
  }
  return data.user;
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser; token: string } | { error: string }> {
  const { data, error } = await apiLogin(email, password);
  if (error || !data) return { error: error || 'Erreur de connexion' };

  localStorage.setItem('token', data.token);
  return { user: data.user, token: data.token };
}

export async function signUp(email: string, password: string, fullName?: string, roleName?: string): Promise<{ user: AuthUser; token: string } | { error: string }> {
  const { data, error } = await apiRegister(email, password, fullName, roleName);
  if (error || !data) return { error: error || "Erreur d'inscription" };

  localStorage.setItem('token', data.token);
  return { user: data.user, token: data.token };
}

export async function signOut() {
  localStorage.removeItem('token');
}
