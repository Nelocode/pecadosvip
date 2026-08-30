import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  decryptKycDocument,
  deriveKycMasterKey,
  encryptKycDocument,
  KycVaultError,
} from '../lib/security/kyc-vault.ts';

test('encrypts and decrypts a binary document using AES-256-GCM', () => {
  const secretKey = 'super-secret-kyc-master-passphrase-production';
  const masterKey = deriveKycMasterKey(secretKey);

  const sampleDoc = Buffer.from('PDF_OR_IMAGE_PASSPORT_DATA_CONTENT_12345', 'utf8');

  const encrypted = encryptKycDocument(sampleDoc, masterKey);

  assert.equal(encrypted.algorithm, 'aes-256-gcm');
  assert.ok(encrypted.encryptedDataBase64.length > 0);
  assert.ok(encrypted.ivHex.length === 24); // 12 bytes = 24 hex chars
  assert.ok(encrypted.authTagHex.length === 32); // 16 bytes = 32 hex chars

  const decrypted = decryptKycDocument(encrypted, masterKey);
  assert.deepEqual(decrypted, sampleDoc);
  assert.equal(decrypted.toString('utf8'), 'PDF_OR_IMAGE_PASSPORT_DATA_CONTENT_12345');
});

test('fails closed when attempting to decrypt with wrong master key or tampered ciphertext', () => {
  const masterKey = deriveKycMasterKey('valid-secret-key-for-kyc-vault-1');
  const wrongKey = deriveKycMasterKey('wrong-secret-key-for-kyc-vault-2');

  const sampleDoc = Buffer.from('SENSITIVE_KYC_ID_DATA', 'utf8');
  const encrypted = encryptKycDocument(sampleDoc, masterKey);

  // Attempt decryption with wrong key -> should throw TAMPERING_DETECTED or DECRYPTION_FAILED
  assert.throws(
    () => decryptKycDocument(encrypted, wrongKey),
    (err: unknown) => err instanceof KycVaultError && err.code === 'TAMPERING_DETECTED'
  );

  // Tamper with ciphertext
  const tamperedPayload = {
    ...encrypted,
    encryptedDataBase64: Buffer.from('TAMPERED_DATA').toString('base64'),
  };

  assert.throws(
    () => decryptKycDocument(tamperedPayload, masterKey),
    (err: unknown) => err instanceof KycVaultError && err.code === 'TAMPERING_DETECTED'
  );
});
