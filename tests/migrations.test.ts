import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDatabase } from '../lib/db/database.ts';
import { runDatabaseMigrations } from '../lib/db/migrations.ts';

test('runs database schema migrations and creates required indexes and tables', () => {
  runDatabaseMigrations();
  const db = getDatabase();

  const stmt = db.prepare('SELECT name FROM _schema_migrations');
  const rows = stmt.all() as Array<{ name: string }>;
  assert.ok(rows.length >= 3);

  const appliedNames = rows.map((r) => r.name);
  assert.ok(appliedNames.includes('001_add_indexes_for_performance'));
  assert.ok(appliedNames.includes('002_add_availability_and_clicks_tables'));
  assert.ok(appliedNames.includes('003_add_redirects_table'));
});
