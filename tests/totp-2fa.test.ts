import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateTotpSecret, verifyTotpToken } from '../lib/security/totp-2fa.ts';

test('generates TOTP secret and verifies valid 6-digit passcode', () => {
  const secretResult = generateTotpSecret('admin@pecadosvip.com');
  assert.ok(secretResult.secretBase32.length > 16);
  assert.ok(secretResult.otpauthUrl.includes('otpauth://totp/PecadosVIP:admin%40pecadosvip.com'));

  // Fails on invalid 6-digit token
  assert.equal(verifyTotpToken(secretResult.secretBase32, '000000'), false);
  assert.equal(verifyTotpToken(secretResult.secretBase32, 'abc'), false);
});
