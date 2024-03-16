import { Router } from 'express'
import { MCsrf } from '@/middlewares/csrf'
import { MFingerprint } from '@/middlewares/fingerprint'
import { UserController } from './user.controller'
import { MAuth } from '@/middlewares/auth'

const router = Router()

const ROUTE_PREFIX = 'user'

router.get(`/${ROUTE_PREFIX}`, MAuth,  UserController.getUser)

router.post(`/${ROUTE_PREFIX}/login`, MFingerprint, MCsrf, UserController.login)

router.post(`/${ROUTE_PREFIX}/access`, MFingerprint, MAuth, UserController.getNewAccessToken)

export { router as userRouter }

