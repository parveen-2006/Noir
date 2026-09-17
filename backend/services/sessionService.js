import redisClient, { connectRedis } from '../config/redis.js';

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const SESSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export const getSessionKey = (userId) => `session:user:${userId}`;

export const normalizeSessionPayload = (payload = {}) => ({
  userId: String(payload.userId || ''),
  token: payload.token || '',
  createdAt: Number(payload.createdAt) || Date.now(),
  expiresAt: Number(payload.expiresAt) || Date.now() + SESSION_TTL_MS,
  lastSeenAt: Number(payload.lastSeenAt) || Date.now(),
  sessionStatus: payload.sessionStatus || 'active',
});

export const buildSessionPayload = ({
  userId,
  token,
  expiresAt = Date.now() + SESSION_TTL_MS,
  lastSeenAt = Date.now(),
}) => ({
  userId: String(userId),
  token,
  createdAt: Date.now(),
  expiresAt: Number(expiresAt),
  lastSeenAt: Number(lastSeenAt),
  sessionStatus: 'active',
});

export const saveSession = async ({
  userId,
  token,
  expiresAt = Date.now() + SESSION_TTL_MS,
  lastSeenAt = Date.now(),
}) => {
  await connectRedis();
  const payload = buildSessionPayload({ userId, token, expiresAt, lastSeenAt });
  const ttlMs = Math.max(1, Number(payload.expiresAt) - Date.now());

  await redisClient.set(getSessionKey(userId), JSON.stringify(payload), {
    PX: ttlMs,
  });

  return payload;
};

export const getStoredSession = async (userId) => {
  await connectRedis();
  const rawSession = await redisClient.get(getSessionKey(userId));

  if (!rawSession) {
    return null;
  }

  const session = normalizeSessionPayload(JSON.parse(rawSession));

  if (!session.userId || !session.token || Number(session.expiresAt) <= Date.now()) {
    await deleteSession(userId);
    return null;
  }

  return session;
};

export const touchSession = async (userId) => {
  await connectRedis();
  const currentSession = await getStoredSession(userId);

  if (!currentSession) {
    return null;
  }

  const remainingMs = Math.max(1, Number(currentSession.expiresAt) - Date.now());
  const updatedSession = {
    ...currentSession,
    lastSeenAt: Date.now(),
    sessionStatus: 'active',
  };

  await redisClient.set(getSessionKey(userId), JSON.stringify(updatedSession), {
    PX: remainingMs,
  });

  return updatedSession;
};

export const deleteSession = async (userId) => {
  await connectRedis();
  await redisClient.del(getSessionKey(userId));
  return true;
};

export const shouldPromptForSession = (lastSeenAt, now = Date.now()) => {
  const elapsed = now - (Number(lastSeenAt) || now);
  return elapsed >= SESSION_CHECK_INTERVAL_MS;
};
