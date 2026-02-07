import { redisClient } from '..';
import isJson from './isJson';

export async function getCache(key) {
  const cacheValue = await redisClient.get(key);
  if (cacheValue) return isJson(cacheValue) ? 
    JSON.stringify(cacheValue) : 
    cacheValue;
  return undefined;
};

export async function setCache(key, value, expiry = 900) {
  await redisClient.set(
    key,
    isJson(value) ? JSON.stringify(value) : value,
    { EX: expiry }
  );
  return value;
};
