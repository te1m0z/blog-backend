import type { Request, Response } from 'express'
//import { ZodError } from 'zod'
//
//import { createAccessToken } from './jwt.services'
//import { generateTestJwtSchema } from './jwt.validation'
//
import { somethingWentWrong } from '@/helpers/http'

abstract class JwtController {

  static async generate(req: Request, res: Response) {
    //
    try {
      //
      //const headers = generateTestJwtSchema.parse(req.headers)
      //
      //const posts = await createAccessToken({ ...headers })
      //
      return res.json({ name: 'dima' })
    } catch (error: unknown) {
      //
      return somethingWentWrong(res)
    }
  }
}

export {
  JwtController,
}
