import type { Request, Response } from 'express'
import { Router } from 'express'
import { CsrfController } from './csrf.controller'
import { CsrfStorage } from '@/middlewares/csrf'

const router = Router()

const ROUTE_PREFIX = 'csrf'

/**
 * POST /csrf/ - generate CSRF Token
 */

router.post(`/${ROUTE_PREFIX}/`, CsrfController.generate)
//
router.get(`/${ROUTE_PREFIX}/`, (req: Request, res: Response) => {
  return res.json(CsrfStorage.get(req.session.id))
})

export { router as csrfRouter }

