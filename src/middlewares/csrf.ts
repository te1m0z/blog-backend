import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { forbidden, csrfValidationFailed } from '@/helpers/http'
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
    const isValid = CsrfStorage.isValid(csrf)
    //
    if (!isValid) {
      throw null
    }
    
    next()
  } catch {
    return forbidden(res)
  }
}

export { MCsrf, CsrfStorage }

