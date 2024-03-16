import { prisma } from '@/prisma/client'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { logError } from '@/config/logger'
import { JWT_SECRET, JWT_ACCESS_DAYS_ALIVE, JWT_ACCESS_SEC_EXPIRES } from '@/config/env'

// Базовый интерфейс создания JWT токенов
export interface IBaseJwtPayload extends JwtPayload {
  iss: 'login' | 'regenerate_access'
}

interface ICreateTokensParams extends IBaseJwtPayload {
  fingerprint: string
}

interface ICreateTokensResponse {
  access_token: string
  refresh_token: string
}

interface ICreateAccessParams extends IBaseJwtPayload {}

interface ICreateAccessTokenResponse {
  access_token: string
}

async function createTokens(payload: ICreateTokensParams, options: SignOptions = {}): Promise<ICreateTokensResponse> {
  //
  try {
    //
    const { sub, iss, fingerprint } = payload
    //
    const nowInSec = moment().unix() // current timestamp in seconds
    const jti = uuid() // unique ID of token

    const durationToAdd = moment.duration(JWT_ACCESS_DAYS_ALIVE, 'days')
    // when token will only be refreshed with refresh token
    const die = moment.unix(nowInSec).add(durationToAdd).unix()

    // Public data of token
    const generatePayload: JwtPayload = {
      iat: nowInSec, // timestamp создания jwt
      nbf: nowInSec, // после какого времени jwt валиден
      exp: nowInSec + JWT_ACCESS_SEC_EXPIRES, // до какого времени jwt валиден
      jti,
      die,
    }
    //
    if (sub) generatePayload.sub = sub
    //
    if (iss) generatePayload.iss = iss
    //
    const generateOptions: SignOptions = {
      ...options,
    }
    //
    const access_token = jwt.sign(generatePayload, JWT_SECRET, generateOptions)
    const refresh_token = uuid()
    // Prepare data to inserting in DB
    const jwtAccessTokenData = { data: { jti, fingerprint, expires: new Date(die) } }
    const jwtRefreshTokenData = { data: { jti: refresh_token, fingerprint, expires: moment().add(30, 'days').toDate() } }
    // Open transaction to put data correctly
    await prisma.$transaction([
      prisma.jwtAccessToken.create(jwtAccessTokenData),
      prisma.jwtRefreshToken.create(jwtRefreshTokenData),
    ])
    //
    return {
      access_token,
      refresh_token,
    }
    //
  } catch (error: unknown) {
    //
    logError('JWT::generate error:', error)
    //
    throw error
  }
}

async function createAccessToken(
  payload: ICreateAccessParams,
  options: SignOptions = {},
): Promise<ICreateAccessTokenResponse> {
  //
  try {
    //
    const { sub, iss } = payload
    //
    const nowInSec = moment().unix() // now date in seconds
    const jti = uuid() // unique ID of token
    
    const durationToAdd = moment.duration(JWT_ACCESS_DAYS_ALIVE, 'days')
    // when token will only be refreshed with refresh token
    const die = moment.unix(nowInSec).add(durationToAdd).unix()

    // Public data of token
    const generatePayload: JwtPayload = {
      iat: nowInSec, // дата и время создания jwt
      nbf: nowInSec, // после какого времени jwt валиден
      exp: nowInSec + JWT_ACCESS_SEC_EXPIRES, // до какого времени jwt валиден
      jti,
      die,
    }
    //
    if (sub) generatePayload.sub = sub
    //
    if (iss) generatePayload.iss = iss
    //
    const generateOptions: SignOptions = {
      ...options,
    }
    //
    const access_token = jwt.sign(generatePayload, JWT_SECRET, generateOptions)
    //
    return {
      access_token,
    }
    //
  } catch (error: unknown) {
    //
    logError('JWT::generate error:', error)
    //
    throw error
  }
}

function isAccessTokenValid(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)

    return true
  } catch (e) {
    return false
  }
}

function parseAccessToken(token: string): IBaseJwtPayload | null {
  try {
    return jwt.decode(token) as IBaseJwtPayload
  } catch (e) {
    return null
  }
}

export {
  createTokens,
  createAccessToken,
  isAccessTokenValid,
  parseAccessToken,
}
