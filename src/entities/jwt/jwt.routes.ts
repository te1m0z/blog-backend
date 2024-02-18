import { Router } from 'express'
import { JwtController } from './jwt.controller'

const router = Router()

const ROUTE_PREFIX = 'jwt'

//router.get(`/${ROUTE_PREFIX}/`, PostController.all);
//router.get(`/${ROUTE_PREFIX}/:id`, PostController.getById);

//router.post(`/${ROUTE_PREFIX}/test`, JwtController.generate); // !!!!!!!!!!! delete

export { router as jwtRouter }

