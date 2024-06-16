import { json } from 'express'

export const jsonMiddleware = json({
  limit: '500kb',
  strict: true,
})
