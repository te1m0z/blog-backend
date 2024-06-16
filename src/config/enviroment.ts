// import { join } from 'node:path';
import { config } from 'dotenv';

config();

type TEnvVarKey =
  | 'NODE_ENV'
  | 'JWT_SECRET'
  | 'JWT_ACCESS_DAYS_ALIVE'
  | 'JWT_ACCESS_SEC_EXPIRES'
  | 'JWT_REFRESH_EXPIRES'
  | 'EXPRESS_PORT'
  | 'SENTRY_DSN';

function getEnvVar<T>(keyName: TEnvVarKey): string {
  const value = process.env[keyName];

  if (!value) {
    throw new Error(`Environment error :: ${keyName} is not setted`);
  }

  return value;
}

export const NODE_ENV = getEnvVar('NODE_ENV') as 'development' | 'production';

export const JWT_SECRET = getEnvVar('JWT_SECRET');

export const JWT_ACCESS_DAYS_ALIVE = parseInt(
  getEnvVar('JWT_ACCESS_DAYS_ALIVE')
);

export const JWT_ACCESS_SEC_EXPIRES = parseInt(
  getEnvVar('JWT_ACCESS_SEC_EXPIRES')
);
export const JWT_REFRESH_EXPIRES = parseInt(getEnvVar('JWT_REFRESH_EXPIRES'));
export const EXPRESS_PORT = getEnvVar('EXPRESS_PORT');
// export const SENTRY_DSN = getEnvVar('SENTRY_DSN');
