import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SESSION_TTL_MS,
  getSessionKey,
  normalizeSessionPayload,
} from '../services/sessionService.js';

test('session lifecycle constants are set to a 24-hour window', () => {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const normalized = normalizeSessionPayload({
    userId: 'user-42',
    token: 'abc',
    expiresAt,
  });

  assert.equal(SESSION_TTL_MS, 24 * 60 * 60 * 1000);
  assert.equal(getSessionKey('user-42'), 'session:user:user-42');
  assert.equal(normalized.userId, 'user-42');
  assert.equal(normalized.token, 'abc');
  assert.equal(normalized.expiresAt, expiresAt);
});
