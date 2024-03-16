import { prisma } from '@/prisma/client'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { logError } from '@/config/logger'
import { JWT_SECRET } from '@/config/env'

export type TCreateAccessPayload = JwtPayload & {
  iss: 'login' | 'regenerate_access'
  // fingerprint: string
}

type TAccessTokenFunc = {
    access_token: string
    refresh_token: string
}

interface ICreateAccessParams extends TCreateAccessPayload {
  // access_token: string
}

interface ICreateAccessTokenResponse {
  access_token: string
}

async function createTokens(payload: TCreateAccessPayload, options: SignOptions = {}): Promise<TAccessTokenFunc> {
  //
  try {
    //
    const { sub, iss, fingerprint } = payload
    //
    const nowInSec = moment().unix() // now date in seconds
    const jti = uuid() // unique ID of token
    const die = nowInSec + 15 // when token will only be refreshed with refresh token

    // Public data of token
    const generatePayload: JwtPayload = {
      iat: nowInSec, // дата и время создания jwt
      nbf: nowInSec, // после какого времени jwt валиден
      exp: nowInSec + 3600, // до какого времени jwt валиден
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
    const die = nowInSec + 15 // when token will only be refreshed with refresh token

    // Public data of token
    const generatePayload: JwtPayload = {
      iat: nowInSec, // дата и время создания jwt
      nbf: nowInSec, // после какого времени jwt валиден
      exp: nowInSec + 3600, // до какого времени jwt валиден
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

function parseAccessToken(token: string): string | JwtPayload | null {
  try {
    return jwt.decode(token)
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
