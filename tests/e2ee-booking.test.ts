import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decryptPrivateInquiry, encryptPrivateInquiry } from '../lib/security/e2ee-booking.ts';

test('encrypts and decrypts client private inquiry details end-to-end', () => {
  const inquiry = {
    clientName: 'Carlos M.',
    contactMethod: 'WhatsApp',
    preferredCity: 'Madrid',
    modelId: 'valeria',
    requestedDate: '2026-09-01T20:00:00Z',
    notes: 'Reserva para evento privado en hotel de lujo.',
  };

  const secretKey = 'agency-private-key-12345';

  const encryptedPayload = encryptPrivateInquiry(inquiry, secretKey);
  assert.ok(encryptedPayload.encryptedDataBase64.length > 0);

  const decrypted = decryptPrivateInquiry(encryptedPayload, secretKey);
  assert.equal(decrypted.clientName, 'Carlos M.');
  assert.equal(decrypted.preferredCity, 'Madrid');
  assert.equal(decrypted.modelId, 'valeria');
});
