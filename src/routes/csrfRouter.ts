import type { Request, Response } from 'express';
import { Router } from 'express';
import { CsrfController } from '@/controllers/csrfController';
import { csrfService } from '@/services';
import { NODE_ENV } from '@/config/enviroment';

const router = Router();

const ROUTER_PREFIX = 'csrf';

router.post(`/${ROUTER_PREFIX}/`, CsrfController.generate);

if (NODE_ENV === 'development') {
  router.get(`/${ROUTER_PREFIX}/`, async (_: Request, res: Response) => {
    return res.json(await csrfService.getAllCsrfTokens());
  });
}

export { router as csrfRouter };
