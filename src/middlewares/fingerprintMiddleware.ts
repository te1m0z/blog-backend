import type { NextFunction, Request, Response } from 'express'
import { hashSync } from 'bcrypt'
import { z } from 'zod'
import { badRequest } from '@/helpers/http'

type TFinger = {
    userAgent: string
    localeLang: string
    timeZone: string
}

const MFingerprintHeadersSchema = z.object({
  'user-agent': z.string().min(1),
  'accept-language': z.string().min(1),
  'x-timezone': z.string().min(1),
}).transform((data): TFinger => {
  return {
    userAgent: data['user-agent'],
    localeLang: data['accept-language'],
    timeZone: data['x-timezone'],
  }
})

export const fingerprintMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //
  try {
    //
    const { userAgent, localeLang, timeZone } = MFingerprintHeadersSchema.parse(req.headers)
    //
    if (!userAgent || !localeLang || !timeZone) {
      throw null
    }
    // Генерация отпечатка клиента
    const fingerprint = hashSync(`${userAgent}-${localeLang}-${timeZone}`, 5)
    // установка в запрос дальше
    req.fingerprint = fingerprint
    //
    next()
    //
  } catch (error: unknown) {
    //
    return badRequest(res)
  }
}
