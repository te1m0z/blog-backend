import { Router } from 'express'
import { MCsrf } from '@/middlewares/csrf'
import { MAuth } from '@/middlewares/auth'
import { PostController } from './post.controller'

const router = Router()

const ROUTE_PREFIX = 'post'

router.get(`/${ROUTE_PREFIX}/`, PostController.all)

router.get(`/${ROUTE_PREFIX}/:id`, PostController.getById)

//MCsrf
router.post(`/${ROUTE_PREFIX}/`, MAuth, PostController.create)

export { router as postRouter }

