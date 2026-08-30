import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  authenticateUser,
  AuthError,
  createSessionToken,
  enforceRolePermission,
  revokeSessionToken,
  validateSessionToken,
} from '../lib/security/auth-service.ts';

test('authenticates seeded users from SQLite database and issues session tokens', () => {
  const user = authenticateUser('admin@pecadosvip.com', 'SuperAdmin123!');
  assert.equal(user.email, 'admin@pecadosvip.com');
  assert.equal(user.role, 'super_admin');

  const session = createSessionToken(user.id, '127.0.0.1', 'TestRunner');
  assert.ok(session.token.length > 30);

  const validated = validateSessionToken(session.token);
  assert.equal(validated.user.email, 'admin@pecadosvip.com');
  assert.equal(validated.user.role, 'super_admin');
});

test('rejects invalid password or non-existent user fail-closed', () => {
  assert.throws(
    () => authenticateUser('admin@pecadosvip.com', 'WrongPassword!'),
    (err: unknown) => err instanceof AuthError && err.code === 'INVALID_CREDENTIALS'
  );

  assert.throws(
    () => authenticateUser('fake@pecadosvip.com', 'SuperAdmin123!'),
    (err: unknown) => err instanceof AuthError && err.code === 'INVALID_CREDENTIALS'
  );
});

test('revokes session token cleanly from SQLite database', () => {
  const user = authenticateUser('booking@pecadosvip.com', 'BookingAgent123!');
  const session = createSessionToken(user.id);

  revokeSessionToken(session.token);

  assert.throws(
    () => validateSessionToken(session.token),
    (err: unknown) => err instanceof AuthError && err.code === 'UNAUTHORIZED'
  );
});

test('enforces RBAC permissions across roles', () => {
  // Super admin passes any permission check
  assert.doesNotThrow(() => enforceRolePermission('super_admin', ['kyc_officer']));

  // Booking agent passes booking check but fails kyc check
  assert.doesNotThrow(() => enforceRolePermission('booking_agent', ['booking_agent']));
  assert.throws(
    () => enforceRolePermission('booking_agent', ['kyc_officer']),
    (err: unknown) => err instanceof AuthError && err.code === 'FORBIDDEN'
  );
});
