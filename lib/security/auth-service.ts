import { randomBytes } from 'node:crypto';
import { getDatabase, verifyPassword } from '../db/database.ts';
import type { CmsRole } from '../content/types.ts';

export type UserRecord = {
  id: string;
  email: string;
  role: CmsRole;
  createdAt: string;
};

export type SessionRecord = {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
};

export class AuthError extends Error {
  public readonly code: 'INVALID_CREDENTIALS' | 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN';

  constructor(code: 'INVALID_CREDENTIALS' | 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN', message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/**
 * Authenticates a user against the SQLite database using email & password.
 */
export function authenticateUser(email: string, password: string): UserRecord {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, email, password_hash, role, created_at FROM users WHERE email = ?');
  const userRow = stmt.get(email.trim().toLowerCase()) as {
    id: string;
    email: string;
    password_hash: string;
    role: CmsRole;
    created_at: string;
  } | undefined;

  if (!userRow) {
    throw new AuthError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos.');
  }

  const isValid = verifyPassword(password, userRow.password_hash);
  if (!isValid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos.');
  }

  return {
    id: userRow.id,
    email: userRow.email,
    role: userRow.role,
    createdAt: userRow.created_at,
  };
}

/**
 * Creates a secure session token valid for 24 hours in SQLite database.
 */
export function createSessionToken(
  userId: string,
  ipAddress: string = '127.0.0.1',
  userAgent: string = 'Unknown'
): SessionRecord {
  const db = getDatabase();
  const sessionId = `sess-${Date.now()}-${randomBytes(8).toString('hex')}`;
  const token = randomBytes(32).toString('hex');

  // 24 hours expiry
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO sessions (id, token, user_id, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(sessionId, token, userId, expiresAt, ipAddress, userAgent);

  return {
    id: sessionId,
    token,
    userId,
    expiresAt,
    ipAddress,
    userAgent,
  };
}

/**
 * Validates a session token and returns the authenticated user record.
 */
export function validateSessionToken(token: string): { user: UserRecord; session: SessionRecord } {
  if (!token) {
    throw new AuthError('UNAUTHORIZED', 'No se proporcionó un token de sesión.');
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT s.id as session_id, s.token, s.user_id, s.expires_at, s.ip_address, s.user_agent,
           u.id as user_id, u.email, u.role, u.created_at as user_created_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ?
  `);

  const row = stmt.get(token) as {
    session_id: string;
    token: string;
    user_id: string;
    expires_at: string;
    ip_address?: string;
    user_agent?: string;
    email: string;
    role: CmsRole;
    user_created_at: string;
  } | undefined;

  if (!row) {
    throw new AuthError('UNAUTHORIZED', 'Sesión no válida o revocada.');
  }

  const nowIso = new Date().toISOString();
  if (row.expires_at < nowIso) {
    // Delete expired session
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    throw new AuthError('SESSION_EXPIRED', 'La sesión ha expirado.');
  }

  return {
    user: {
      id: row.user_id,
      email: row.email,
      role: row.role,
      createdAt: row.user_created_at,
    },
    session: {
      id: row.session_id,
      token: row.token,
      userId: row.user_id,
      expiresAt: row.expires_at,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    },
  };
}

/**
 * Revokes a session token from the SQLite database.
 */
export function revokeSessionToken(token: string): void {
  const db = getDatabase();
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/**
 * Enforces Role-Based Access Control (RBAC) permissions.
 */
export function enforceRolePermission(userRole: CmsRole, allowedRoles: CmsRole[]): void {
  if (userRole === 'super_admin') return; // Super admin has global access
  if (!allowedRoles.includes(userRole)) {
    throw new AuthError('FORBIDDEN', `El rol '${userRole}' no tiene permisos para realizar esta acción.`);
  }
}
