const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || `Erreur ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Erreur réseau' };
  }
}

// ─── Auth ────────────────────────────────────────────────
export async function apiLogin(email: string, password: string) {
  return request<{ user: any; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(email: string, password: string, full_name?: string, role_name?: string) {
  return request<{ user: any; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name, role_name }),
  });
}

export async function apiGetMe() {
  return request<{ user: any }>('/auth/me');
}

// ─── Dashboard ──────────────────────────────────────────
export async function apiGetDashboardStats() {
  return request<{ stats: any }>('/dashboard/stats');
}

// ─── Projects ───────────────────────────────────────────
export async function apiGetProjects() {
  return request<{ projects: any[] }>('/projects');
}

export async function apiCreateProject(data: any) {
  return request<{ project: any }>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Tasks ──────────────────────────────────────────────
export async function apiGetTasks() {
  return request<{ tasks: any[] }>('/tasks');
}

export async function apiCreateTask(data: any) {
  return request<{ task: any }>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateTaskStatus(id: string, status: string) {
  return request<{ task: any }>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Treasury ───────────────────────────────────────────
export async function apiGetTreasury() {
  return request<{ logs: any[] }>('/treasury');
}

export async function apiCreateTreasuryLog(data: any) {
  return request<{ log: any }>('/treasury', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Users ──────────────────────────────────────────────
export async function apiGetUsers() {
  return request<{ users: any[] }>('/users');
}

// ─── Knowledge ──────────────────────────────────────────
export async function apiGetArticles() {
  return request<{ articles: any[] }>('/knowledge');
}

export async function apiCreateArticle(data: any) {
  return request<{ article: any }>('/knowledge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
