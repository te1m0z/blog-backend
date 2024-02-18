import type { NextFunction, Request, Response } from 'express'
import { somethingWentWrong } from '@/helpers/http'
import { logError } from '@/config/logger'

const MFatal = (err: Error, _: Request, res: Response, __: NextFunction) => {
  //
  logError('MFatal', err.stack || err.message || err.name || err)
  //
  return somethingWentWrong(res)
}

export {
  MFatal,
}
