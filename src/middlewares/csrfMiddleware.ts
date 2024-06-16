import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { csrfService } from '@/services';
import { forbidden } from '@/helpers/http';

export const csrfMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //
  try {
    const schema = z.object({
      csrf: z
        .string({
          required_error: 'must be provided'
        })
        .min(1, {
          message: 'must be filled'
        })
    });
    //
    const { csrf } = schema.parse(req.body);
    // Старт проверки
    const isValid = csrfService.isCsrfTokenValid(csrf);
    //
    if (!isValid) {
      throw new Error('Invalid CSRF token');
    }

    await csrfService.invalidateCsrfToken(csrf);

    next();
  } catch {
    return forbidden(res);
  }
};
