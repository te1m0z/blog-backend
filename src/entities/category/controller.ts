import type { Request, Response } from 'express';
import { ZodError, z } from 'zod';
//
import { getCategories } from './services';
//
import { wrongData, notFound } from '@/helpers/http';

abstract class CategoryController {
  static async getBySlug(req: Request, res: Response) {
    const schema = z.object({
      slug: z.string().min(1).max(100).nullish()
    });
    //
    try {
      //
      const { slug } = schema.parse(req.params);
      //
      const categories = await getCategories(slug);
      //
      return res.json(
        categories.map((category) => ({
          type: 'category',
          id: category.id,
          attributes: {
            name: category.name,
            slug: category.slug
          },
          ...(category.parentId && {
            relationships: {
              category: {
                data: {
                  type: 'category',
                  id: category.parentId
                }
              }
            }
          })
        }))
      );
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      //
      return notFound(res);
    }
  }
}

export { CategoryController };
