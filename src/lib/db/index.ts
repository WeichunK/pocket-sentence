import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'pocket.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDB() {
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  
  // Seed initial settings if not exists
  const stmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  stmt.run('retention_period_days', '365');
}

export default db;
