import { createClient } from 'redis';
import { logger } from '@/utils/logger'

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err)
    logger.error('Redis Client Error', err)
});

redisClient.connect();

export { redisClient };
