import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { wrongData, somethingWentWrong, csrfValidationFailed } from '@/helpers/http'
import { CsrfStorage } from '@/core/CsrfStorage'

const MCsrfBodySchema = z.object({
  csrf: z.string({
    required_error: 'must be provided',
  })
    .min(1, {
      message: 'must be filled',
    }),
})

function MCsrf(req: Request, res: Response, next: NextFunction) {
  //
  try {
    //
    const { csrf } = MCsrfBodySchema.parse(req.body)
    // Старт проверки
    const isValid = CsrfStorage.isValid(req.sessionID, csrf)
    //
    if (isValid) {
      next()
      return
    }
    //
    csrfValidationFailed(res)
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

export { MCsrf, CsrfStorage }

