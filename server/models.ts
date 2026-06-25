import { getDb } from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function uuid(): string {
  return crypto.randomUUID();
}

// ─── Auth ────────────────────────────────────────────────
export function createUser(email: string, password: string, fullName?: string, roleName?: string) {
  const db = getDb();
  const passwordHash = bcrypt.hashSync(password, 10);
  const id = uuid();
  const role = roleName
    ? db.prepare('SELECT id FROM roles WHERE name = ?').get(roleName) as { id: string } | undefined
    : null;

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email, passwordHash, fullName || null, role?.id || null);

  return getUserById(id);
}

export function verifyPassword(email: string, password: string) {
  const db = getDb();
  const user = db.prepare(`
    SELECT u.*, r.name as role_name, r.label as role_label
    FROM users u LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `).get(email) as any;

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;

  return sanitizeUser(user);
}

export function getUserById(id: string) {
  const db = getDb();
  const user = db.prepare(`
    SELECT u.*, r.name as role_name, r.label as role_label
    FROM users u LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `).get(id) as any;
  return user ? sanitizeUser(user) : null;
}

function sanitizeUser(u: any) {
  return {
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    avatar_url: u.avatar_url,
    role_id: u.role_id,
    role_name: u.role_name,
    role_label: u.role_label,
    is_active: !!u.is_active,
    created_at: u.created_at,
  };
}

// ─── Projects ───────────────────────────────────────────
export function getProjects(userId: string, roleName: string) {
  const db = getDb();
  if (['admin', 'ceo', 'coo', 'cto'].includes(roleName)) {
    return db.prepare('SELECT p.*, u.full_name as owner_name FROM projects p LEFT JOIN users u ON p.owner_id = u.id ORDER BY p.created_at DESC').all();
  }
  return db.prepare('SELECT p.*, u.full_name as owner_name FROM projects p LEFT JOIN users u ON p.owner_id = u.id WHERE p.owner_id = ? ORDER BY p.created_at DESC').all(userId);
}

export function createProject(data: { name: string; description?: string; owner_id: string; start_date?: string; deadline?: string; budget?: number }) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO projects (id, name, description, owner_id, start_date, deadline, budget)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, data.description || null, data.owner_id, data.start_date || null, data.deadline || null, data.budget || null);
  return { id, ...data };
}

// ─── Tasks ───────────────────────────────────────────────
export function getTasks(userId: string, roleName: string) {
  const db = getDb();
  if (['admin', 'ceo', 'coo', 'cto'].includes(roleName)) {
    return db.prepare(`
      SELECT t.*, u_a.full_name as assignee_name, u_c.full_name as creator_name, p.name as project_name
      FROM tasks t
      LEFT JOIN users u_a ON t.assignee_id = u_a.id
      LEFT JOIN users u_c ON t.created_by = u_c.id
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY t.created_at DESC
    `).all();
  }
  return db.prepare(`
    SELECT t.*, u_a.full_name as assignee_name, u_c.full_name as creator_name, p.name as project_name
    FROM tasks t
    LEFT JOIN users u_a ON t.assignee_id = u_a.id
    LEFT JOIN users u_c ON t.created_by = u_c.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ? OR t.created_by = ?
    ORDER BY t.created_at DESC
  `).all(userId, userId);
}

export function createTask(data: { title: string; description?: string; priority?: string; project_id?: string; assignee_id?: string; created_by: string; due_date?: string }) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO tasks (id, title, description, priority, project_id, assignee_id, created_by, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.title, data.description || null, data.priority || 'medium', data.project_id || null, data.assignee_id || null, data.created_by, data.due_date || null);
  return { id, ...data };
}

export function updateTaskStatus(id: string, status: string) {
  const db = getDb();
  const completedAt = status === 'done' ? new Date().toISOString() : null;
  db.prepare('UPDATE tasks SET status = ?, completed_at = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, completedAt, id);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

// ─── Treasury ────────────────────────────────────────────
export function getTreasuryLogs() {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, u.full_name as creator_name
    FROM treasury_logs t LEFT JOIN users u ON t.created_by = u.id
    ORDER BY t.created_at DESC
  `).all();
}

export function createTreasuryLog(data: { amount: number; type: string; description?: string; category?: string; created_by: string }) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO treasury_logs (id, amount, type, description, category, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.amount, data.type, data.description || null, data.category || null, data.created_by);
  return { id, ...data };
}

// ─── Users (RH) ──────────────────────────────────────────
export function getUsers() {
  const db = getDb();
  return db.prepare(`
    SELECT u.id, u.email, u.full_name, u.avatar_url, u.is_active, u.created_at,
           r.name as role_name, r.label as role_label
    FROM users u LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY r.level, u.full_name
  `).all();
}

// ─── Knowledge ───────────────────────────────────────────
export function getArticles() {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, u.full_name as author_name, r.label as target_role_label
    FROM knowledge_articles a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN roles r ON a.target_role_id = r.id
    ORDER BY a.created_at DESC
  `).all();
}

export function createArticle(data: { title: string; content: string; author_id: string; target_role_id?: string; tags?: string[] }) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO knowledge_articles (id, title, content, author_id, target_role_id, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.title, data.content, data.author_id, data.target_role_id || null, JSON.stringify(data.tags || []));
  return { id, ...data };
}

// ─── Equity ──────────────────────────────────────────────
export function getEquityLogs() {
  const db = getDb();
  return db.prepare(`
    SELECT e.*, u.full_name as user_name
    FROM equity_logs e LEFT JOIN users u ON e.user_id = u.id
    ORDER BY e.created_at DESC
  `).all();
}

// ─── Dashboard stats ─────────────────────────────────────
export function getDashboardStats() {
  const db = getDb();
  const activeProjects = (db.prepare("SELECT COUNT(*) as c FROM projects WHERE status IN ('planning','active')").get() as any).c;
  const tasksInProgress = (db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status IN ('todo','in_progress','review')").get() as any).c;
  const urgentTasks = (db.prepare("SELECT COUNT(*) as c FROM tasks WHERE priority IN ('high','urgent') AND status NOT IN ('done','cancelled')").get() as any).c;
  const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users WHERE is_active = 1').get() as any).c;
  const totalIncome = (db.prepare("SELECT COALESCE(SUM(amount), 0) as s FROM treasury_logs WHERE type = 'income'").get() as any).s;
  const totalExpense = (db.prepare("SELECT COALESCE(SUM(amount), 0) as s FROM treasury_logs WHERE type = 'expense'").get() as any).s;

  return { activeProjects, tasksInProgress, urgentTasks, totalUsers, totalIncome, totalExpense };
}
