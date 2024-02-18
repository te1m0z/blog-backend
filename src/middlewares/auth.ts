import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { wrongData, somethingWentWrong, authorizationFailed } from '@/helpers/http'
import { isAccessTokenValid } from '@/entities/jwt/jwt.services'

const MAuthBodySchema = z.object({
  authorization: z.string({
    required_error: 'must be provided',
  })
    .min(8, { // 'Bearer 1'
      message: 'must be filled',
    }),
})

function MAuth(req: Request, res: Response, next: NextFunction) {
  //
  try {
    //
    const { authorization } = MAuthBodySchema.parse(req.headers)
    //
    if (!authorization) {
      authorizationFailed(res)
    }
    const bearer = authorization.split(' ')
    const accessToken = bearer[1]
    //
    if (!accessToken) {
      authorizationFailed(res)
    }
    //
    const isValid = isAccessTokenValid(accessToken)
    //
    if (isValid) {
      req.accessToken = accessToken
      next()
      return
    }
    //
    authorizationFailed(res)
    //
  } catch (error: unknown) {
    //
    if (error instanceof ZodError) {
      return wrongData(res, error.issues)
    }
    //
    return somethingWentWrong(res)
  }
}

export { MAuth }

