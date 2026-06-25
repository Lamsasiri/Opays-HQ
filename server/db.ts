import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'opays-hq.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedData();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      level INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      role_id TEXT REFERENCES roles(id),
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'planning' CHECK (status IN ('planning','active','paused','completed','cancelled')),
      owner_id TEXT REFERENCES users(id),
      start_date TEXT,
      deadline TEXT,
      budget REAL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done','cancelled')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      assignee_id TEXT REFERENCES users(id),
      created_by TEXT REFERENCES users(id),
      due_date TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS task_comments (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      author_id TEXT REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_configs (
      id TEXT PRIMARY KEY,
      role_id TEXT REFERENCES roles(id),
      name TEXT NOT NULL,
      description TEXT,
      prompt_template TEXT,
      tools TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      agent_config_id TEXT REFERENCES agent_configs(id),
      title TEXT,
      messages TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      target_role_id TEXT REFERENCES roles(id),
      author_id TEXT REFERENCES users(id),
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS treasury_logs (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT CHECK (type IN ('income','expense','transfer')),
      description TEXT,
      category TEXT,
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS equity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      shares_vested REAL NOT NULL,
      total_shares REAL NOT NULL,
      vesting_date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedData() {
  const count = db.prepare('SELECT COUNT(*) as c FROM roles').get() as { c: number };
  if (count.c > 0) return;

  const insertRole = db.prepare('INSERT INTO roles (id, name, label, level) VALUES (?, ?, ?, ?)');
  const roles = [
    ['role_admin', 'admin', 'Admin', 1],
    ['role_ceo', 'ceo', 'CEO', 2],
    ['role_coo', 'coo', 'COO', 2],
    ['role_cto', 'cto', 'CTO', 3],
    ['role_sales', 'sales', 'Directeur Commercial', 3],
    ['role_engineer', 'engineer', 'Ingénieur', 4],
    ['role_employee', 'employee', 'Employé', 4],
  ];
  for (const r of roles) insertRole.run(...r);
}
