import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

redisClient.on('error', (error) => {
  console.error('[Redis] Error:', error.message);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('[Redis] connected');
  }

  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
};

export default redisClient;
;