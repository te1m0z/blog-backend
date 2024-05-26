import { Router } from 'express'
import { MAuth } from '@/middlewares/auth'
import { LaboratoryController } from './controller'

const router = Router()

const ROUTE_PREFIX = 'lab'

router.get(`/${ROUTE_PREFIX}/`, LaboratoryController.all)

router.get(`/${ROUTE_PREFIX}/:slug`, LaboratoryController.getBySlug)

router.post(`/${ROUTE_PREFIX}/`, MAuth, LaboratoryController.create)

export { router as laboratoryRouter }

