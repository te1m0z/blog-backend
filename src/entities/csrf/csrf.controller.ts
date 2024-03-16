import type { Request, Response } from 'express'
import { ZodError } from 'zod'
//
import { generateCsrfSchema } from './csrf.validation'
import { wrongData, somethingWentWrong } from '@/helpers/http'
import { CsrfStorage } from '@/middlewares/csrf'

abstract class CsrfController {

  static async generate(req: Request, res: Response) {
    //
    try {
      //
      generateCsrfSchema.parse(req.body)
      generateCsrfSchema.parse(req.query)
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      //
      return somethingWentWrong(res)
    }
    //
    const csrfData = CsrfStorage.generate()
    //
    return res.json(csrfData)
  }
}

export {
  CsrfController,
}
