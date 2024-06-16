import { Router } from 'express'
import { authMiddleware } from '@/middlewares'
import { NoteController } from '@/controllers/noteController'

const router = Router()

const ROUTER_PREFIX = 'note'

router.get(`/${ROUTER_PREFIX}/`, NoteController.all)

router.get(`/${ROUTER_PREFIX}/:slug`, NoteController.getBySlug)

router.post(`/${ROUTER_PREFIX}/`, authMiddleware, NoteController.create)

router.patch(`/${ROUTER_PREFIX}/:id`, authMiddleware, NoteController.update)

router.delete(`/${ROUTER_PREFIX}/:id`, authMiddleware, NoteController.delete)

export { router as noteRouter }
