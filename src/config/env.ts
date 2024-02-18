import { join } from 'node:path'
import { config } from 'dotenv'

config({
  path: join(process.cwd(), '.env'),
})

type TEnvVarKey =
  | 'NODE_ENV'
  | 'JWT_SECRET'
  | 'JWT_ACCESS_EXPIRES'
  | 'JWT_REFRESH_EXPIRES'
  | 'EXPRESS_PORT'
  | 'EXPRESS_SESSION_SECRET'
  | 'EXPRESS_SESSION_MAX_AGE'
  | 'SENTRY_DSN';

/**
 *  Tries to find and return a value by the provided key
 *
 * @param {TEnvKey} keyName - Name of process env variable
 * @returns {string} Value of process env variable
 */
function getEnvVar(keyName: TEnvVarKey): string {
  const value = process.env[keyName]
  // if value not found then throw an error
  if (!value || value.length === 0) {
    throw new Error(`Environment error :: ${keyName} is not set`)
  }
  return value
}

export const NODE_ENV = getEnvVar('NODE_ENV')
export const JWT_SECRET = getEnvVar('JWT_SECRET')
export const JWT_ACCESS_EXPIRES = parseInt(getEnvVar('JWT_ACCESS_EXPIRES'))
export const JWT_REFRESH_EXPIRES = parseInt(getEnvVar('JWT_REFRESH_EXPIRES'))
export const EXPRESS_PORT = getEnvVar('EXPRESS_PORT')
export const EXPRESS_SESSION_SECRET = getEnvVar('EXPRESS_SESSION_SECRET')
export const EXPRESS_SESSION_MAX_AGE = parseInt(getEnvVar('EXPRESS_SESSION_MAX_AGE'))
export const SENTRY_DSN = getEnvVar('SENTRY_DSN')
