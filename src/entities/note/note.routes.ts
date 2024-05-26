import { Router } from 'express'
import { MAuth } from '@/middlewares/auth'
import { NoteController } from './note.controller'

const router = Router()

const ROUTE_PREFIX = 'note'

router.get(`/${ROUTE_PREFIX}/`, NoteController.all)

router.get(`/${ROUTE_PREFIX}/:slug`, NoteController.getBySlug)

router.post(`/${ROUTE_PREFIX}/`, MAuth, NoteController.create)

export { router as noteRouter }

