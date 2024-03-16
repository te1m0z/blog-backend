import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { authorizationFailed } from '@/helpers/http'
import { parseAccessToken } from '@/entities/jwt/jwt.services'

const MAuthBodySchema = z.object({
  authorization: z.string().min(8),
})

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
    const tokenData = parseAccessToken(accessToken)
    //
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

export { MAuth }

