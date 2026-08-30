import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveKycMasterKey, encryptKycDocument } from '../lib/security/kyc-vault.ts';

export function runAutomatedDatabaseBackup(secretKey: string = 'backup-master-secret-key-12345'): {
  backupFile: string;
  checksumSha256: string;
  timestamp: string;
} {
  const dbPath = resolve(process.cwd(), 'data/pecadosvip.db');
  const backupDir = resolve(process.cwd(), 'data/backups');

  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  if (!existsSync(dbPath)) {
    throw new Error(`Database file not found at ${dbPath}`);
  }

  const dbBuffer = readFileSync(dbPath);
  const masterKey = deriveKycMasterKey(secretKey);
  const encryptedPayload = encryptKycDocument(dbBuffer, masterKey);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = resolve(backupDir, `db-backup-${timestamp}.enc.json`);

  writeFileSync(backupFile, JSON.stringify(encryptedPayload, null, 2), 'utf8');

  return {
    backupFile,
    checksumSha256: encryptedPayload.authTagHex,
    timestamp,
  };
}
