import { getDatabase } from './database.ts';

export type MigrationRecord = {
  id: number;
  name: string;
  appliedAt: string;
};

export function runDatabaseMigrations(): void {
  const db = getDatabase();

  // Create migrations table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS _schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedMigrationsStmt = db.prepare('SELECT name FROM _schema_migrations');
  const appliedRows = appliedMigrationsStmt.all() as Array<{ name: string }>;
  const appliedSet = new Set(appliedRows.map((r) => r.name));

  const migrations: Array<{ name: string; sql: string }> = [
    {
      name: '001_add_indexes_for_performance',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_models_city_slug ON models(city_slug);
        CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
      `,
    },
    {
      name: '002_add_availability_and_clicks_tables',
      sql: `
        CREATE TABLE IF NOT EXISTS model_availability (
          model_id TEXT PRIMARY KEY,
          status_state TEXT NOT NULL DEFAULT 'available',
          updated_at TEXT NOT NULL,
          FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS click_analytics (
          id TEXT PRIMARY KEY,
          model_id TEXT NOT NULL,
          channel TEXT NOT NULL,
          origin_city TEXT,
          ip_address TEXT,
          timestamp TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_click_analytics_model ON click_analytics(model_id);
      `,
    },
    {
      name: '003_add_redirects_table',
      sql: `
        CREATE TABLE IF NOT EXISTS seo_redirects (
          id TEXT PRIMARY KEY,
          source_path TEXT UNIQUE NOT NULL,
          target_path TEXT NOT NULL,
          status_code INTEGER DEFAULT 301,
          created_at TEXT NOT NULL
        );
      `,
    },
  ];

  for (const migration of migrations) {
    if (!appliedSet.has(migration.name)) {
      db.exec('BEGIN TRANSACTION;');
      try {
        db.exec(migration.sql);
        const recordStmt = db.prepare(
          'INSERT INTO _schema_migrations (name, applied_at) VALUES (?, ?)'
        );
        recordStmt.run(migration.name, new Date().toISOString());
        db.exec('COMMIT;');
      } catch (error) {
        db.exec('ROLLBACK;');
        throw new Error(`Failed to apply migration ${migration.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}
