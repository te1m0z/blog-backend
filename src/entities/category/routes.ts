import { Router } from 'express'
import { CategoryController } from './controller'

const router = Router()

const ROUTE_PREFIX = 'category'

router.get(`/${ROUTE_PREFIX}/`, CategoryController.getBySlug)

router.get(`/${ROUTE_PREFIX}/:slug`, CategoryController.getBySlug)

export { router as categoryRouter }

