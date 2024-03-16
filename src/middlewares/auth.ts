import type { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import { z } from 'zod'
import { authorizationFailed } from '@/helpers/http'
import { parseAccessToken, isAccessTokenValid } from '@/entities/jwt/jwt.services'

const MAuthBodySchema = z.object({
  authorization: z.string().min(8),
})

/**
 * Токен должен быть валидным и живым
 */
function MAuth(req: Request, res: Response, next: NextFunction) {
  //
  try {
    //
    const { authorization } = MAuthBodySchema.parse(req.headers)
    //
    const bearer = authorization.split(' ')
    const accessToken = bearer[1]
    //
    if (!accessToken) {
      authorizationFailed(res)
    }
    //
    const isValid = isAccessTokenValid(accessToken)

    if (!isValid) {
      throw null
    }
    
    const tokenData = parseAccessToken(accessToken)

    if (!tokenData) {
      throw null
    }

    req.accessToken = accessToken
    req.userId = Number(tokenData.sub)
    
    next()
  } catch {
    return authorizationFailed(res)
  }
}

/**
 * Токен должен быть живым
 */
function MAuthAlive(req: Request, res: Response, next: NextFunction) {
  //
  try {
    //
    const { authorization } = MAuthBodySchema.parse(req.headers)
    //
    const bearer = authorization.split(' ')
    const accessToken = bearer[1]
    //
    if (!accessToken) {
      throw null
    }
    
    const tokenData = parseAccessToken(accessToken)

    if (!tokenData?.die) {
      throw null
    }

    const isTokenValid = tokenData.die > moment().unix()

    if (!isTokenValid) {
      throw null
    }

    req.accessToken = accessToken
    req.userId = Number(tokenData.sub)
    
    next()
  } catch {
    return authorizationFailed(res)
  }
}

export { MAuth, MAuthAlive }

