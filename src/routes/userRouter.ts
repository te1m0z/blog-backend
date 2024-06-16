import { Router } from 'express';
import * as M from '@/middlewares';
import { UserController } from '@/controllers';

const userRouter = Router();

const ROUTER_PREFIX = 'user';

userRouter.get(`/${ROUTER_PREFIX}`, M.authMiddleware, UserController.getUser);

userRouter.post(
  `/${ROUTER_PREFIX}/login`,
  M.fingerprintMiddleware,
  M.csrfMiddleware,
  UserController.login
);

// userRouter.post(`/${ROUTE_PREFIX}/access`, MFingerprint, MAuthAlive, UserController.getNewAccessToken)

export { userRouter };
