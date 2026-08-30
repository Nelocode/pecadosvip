import type { Availability } from './types.ts';
import { getDatabase } from '../db/database.ts';

export type RealTimeStatus = 'available' | 'busy' | 'on_tour' | 'off_duty';

export function setModelRealTimeStatus(modelId: string, status: RealTimeStatus): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO model_availability (model_id, status_state, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(model_id) DO UPDATE SET status_state = excluded.status_state, updated_at = excluded.updated_at
  `);

  stmt.run(modelId, status, now);
}

export function getModelRealTimeStatus(modelId: string): RealTimeStatus {
  const db = getDatabase();
  const stmt = db.prepare('SELECT status_state FROM model_availability WHERE model_id = ?');
  const row = stmt.get(modelId) as { status_state: RealTimeStatus } | undefined;

  return row ? row.status_state : 'available';
}
