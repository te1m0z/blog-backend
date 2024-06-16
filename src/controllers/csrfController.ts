import type { Request, Response } from 'express'
import { z, ZodError } from 'zod'
//
import { csrfService } from '@/services'
import { wrongData, somethingWentWrong } from '@/helpers/http'

export abstract class CsrfController {

  static async generate(req: Request, res: Response) {
    //
    try {
      const schema = z.object({}).strict()
      //
      schema.parse(req.body)
      schema.parse(req.query)
      //
      const csrfToken = await csrfService.generateCsrfToken();

      return res.status(201).json({
        status: true,
        data: csrfToken,
      })
      
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      //
      return somethingWentWrong(res)
    }
  }
}
