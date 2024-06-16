import { Router } from 'express'
import { CategoryController } from '@/controllers'
import { authMiddleware } from '@/middlewares'

const router = Router()

const ROUTER_PREFIX = 'category'

router.get(`/${ROUTER_PREFIX}/all`, CategoryController.getAll)

router.get(`/${ROUTER_PREFIX}/top`, CategoryController.getTopCategories)

router.get(`/${ROUTER_PREFIX}/:slug`, CategoryController.getBySlug)

router.post(`/${ROUTER_PREFIX}`, authMiddleware, CategoryController.create)

router.patch(`/${ROUTER_PREFIX}/:id`, authMiddleware, CategoryController.update)

router.delete(`/${ROUTER_PREFIX}/:id`, authMiddleware, CategoryController.delete)

export { router as categoryRouter }
