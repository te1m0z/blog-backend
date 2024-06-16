import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '@/config/redis';

const CSRF_PREFIX = 'csrf_';

export const generateCsrfToken = async (): Promise<string> => {
  const token = uuidv4();

  await redisClient.set(`${CSRF_PREFIX}${token}`, 'valid', { EX: 10 });

  return token;
};

export const isCsrfTokenValid = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(`${CSRF_PREFIX}${token}`);

  return result === 'valid';
};

export const invalidateCsrfToken = async (token: string): Promise<void> => {
  await redisClient.del(`${CSRF_PREFIX}${token}`);
};


export const getAllCsrfTokens = async (): Promise<string[]> => {
  return await redisClient.keys(`${CSRF_PREFIX}*`)
};
