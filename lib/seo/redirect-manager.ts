import { getDatabase } from '../db/database.ts';

export type SeoRedirectRule = {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  createdAt: string;
};

export function register301Redirect(sourcePath: string, targetPath: string): void {
  const db = getDatabase();
  const id = `redir-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO seo_redirects (id, source_path, target_path, status_code, created_at)
    VALUES (?, ?, ?, 301, ?)
    ON CONFLICT(source_path) DO UPDATE SET target_path = excluded.target_path, created_at = excluded.created_at
  `);

  stmt.run(id, sourcePath, targetPath, now);
}

export function get301Redirect(sourcePath: string): SeoRedirectRule | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, source_path, target_path, status_code, created_at FROM seo_redirects WHERE source_path = ?');
  const row = stmt.get(sourcePath) as {
    id: string;
    source_path: string;
    target_path: string;
    status_code: number;
    created_at: string;
  } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    sourcePath: row.source_path,
    targetPath: row.target_path,
    statusCode: row.status_code,
    createdAt: row.created_at,
  };
}
