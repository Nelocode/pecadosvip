import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const DB_FILE_PATH = process.env.PECADOSVIP_DB_PATH
  ? resolve(process.env.PECADOSVIP_DB_PATH)
  : resolve(process.cwd(), 'data/pecadosvip.db');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbDir = dirname(DB_FILE_PATH);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_FILE_PATH);

  // Enable WAL mode for high concurrency performance
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');

  initializeTables(dbInstance);
  seedInitialUsers(dbInstance);

  return dbInstance;
}

function initializeTables(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      totp_secret TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      age INTEGER,
      nationality TEXT,
      biography TEXT,
      city_slug TEXT NOT NULL,
      height_cm INTEGER,
      weight_kg INTEGER,
      bust_cm INTEGER,
      waist_cm INTEGER,
      hips_cm INTEGER,
      eye_color TEXT,
      hair_color TEXT,
      ethnicity TEXT,
      incall INTEGER DEFAULT 0,
      outcall INTEGER DEFAULT 0,
      coverage_zones_json TEXT,
      rates_json TEXT,
      services_json TEXT,
      tours_json TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      verified_badge INTEGER DEFAULT 0,
      seo_title TEXT,
      meta_description TEXT,
      target_keyword TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kyc_documents (
      id TEXT PRIMARY KEY,
      model_id TEXT NOT NULL,
      document_type TEXT NOT NULL,
      encrypted_data_base64 TEXT NOT NULL,
      iv_hex TEXT NOT NULL,
      auth_tag_hex TEXT NOT NULL,
      uploaded_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT NOT NULL,
      actor_email TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
}

/**
 * Utility for scrypt password hashing
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, storedHashHex] = combinedHash.split(':');
    if (!salt || !storedHashHex) return false;

    const derivedKey = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHashHex, 'hex');

    if (derivedKey.length !== storedBuffer.length) return false;
    return timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    return false;
  }
}

function seedInitialUsers(db: DatabaseSync): void {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const row = countStmt.get() as { count: number };

  if (row && row.count > 0) return;

  const now = new Date().toISOString();
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Seed 4 Production Agency Users (1 per role)
  insertUser.run('usr-super-admin', 'admin@pecadosvip.com', hashPassword('SuperAdmin123!'), 'super_admin', now);
  insertUser.run('usr-booking-agent', 'booking@pecadosvip.com', hashPassword('BookingAgent123!'), 'booking_agent', now);
  insertUser.run('usr-seo-specialist', 'seo@pecadosvip.com', hashPassword('SeoSpecialist123!'), 'seo_specialist', now);
  insertUser.run('usr-kyc-officer', 'kyc@pecadosvip.com', hashPassword('KycOfficer123!'), 'kyc_officer', now);
}
