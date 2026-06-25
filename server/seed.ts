import { getDb } from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export function seedDefaultUsers() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (count.c > 0) return; // Already seeded

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const getRoleId = (name: string) => {
    return (db.prepare('SELECT id FROM roles WHERE name = ?').get(name) as { id: string })?.id;
  };

  const users = [
    { email: 'ceo@opays.io', password: 'admin123', full_name: 'Fenelon Lamsasiri', role: 'ceo' },
    { email: 'admin@opays.io', password: 'admin123', full_name: 'Admin Opays', role: 'admin' },
    { email: 'coo@opays.io', password: 'admin123', full_name: 'COO Opays', role: 'coo' },
    { email: 'cto@opays.io', password: 'admin123', full_name: 'CTO Opays', role: 'cto' },
    { email: 'employee@opays.io', password: 'admin123', full_name: 'Employé Test', role: 'employee' },
  ];

  for (const u of users) {
    const roleId = getRoleId(u.role);
    insertUser.run(
      crypto.randomUUID(),
      u.email,
      bcrypt.hashSync(u.password, 10),
      u.full_name,
      roleId
    );
  }

  console.log(`✅ ${users.length} utilisateurs par défaut créés`);
}
