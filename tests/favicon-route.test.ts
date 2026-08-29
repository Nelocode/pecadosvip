import assert from 'node:assert/strict';
import test from 'node:test';

import { GET } from '../app/favicon.ico/route.ts';

test('favicon fallback returns a local non-script image without a 404', async () => {
  const response = GET();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(await response.text(), /^<svg[\s\S]*<\/svg>$/);
});
