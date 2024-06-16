import type { NextFunction, Request, Response } from 'express'
import { logger } from '@/utils'
import { somethingWentWrong } from '@/helpers/http'

export const errorMiddleware = (err: Error, _: Request, res: Response, __: NextFunction) => {
  //
  logger.error('Express fatal:', err)
  //
  return somethingWentWrong(res)
}
