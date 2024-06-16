import type { Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { categoryService } from '@/services';
import { wrongData, notFound, somethingWentWrong } from '@/helpers/http';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
import { logger } from '@/utils';

export abstract class CategoryController {
  static async getAll(_: Request, res: Response) {
    //
    try {
      const categories = await categoryService.getAllCategories();
      //
      return res.json(categories);
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

  static async getTopCategories(_: Request, res: Response) {
    //
    try {
      //
      const categories = await categoryService.getTopCategories();
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

  static async getBySlug(req: Request, res: Response) {
    //
    try {
      const schema = z.object({
        slug: z.string().min(1).max(100)
      });
      //
      const { slug } = schema.parse(req.params);
      //
      const categories = await categoryService.getChildCategoriesByParentSlug(
        slug
      );
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

  static async create(req: Request, res: Response) {
    //
    try {
      const schema = z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        parentId: z.number().positive().nullish()
      });
      //
      const { name, slug, parentId } = schema.parse(req.body);
      //
      const category = await categoryService.createCategory({
        name,
        slug,
        parentId
      });
      //
      return res.json({
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
      });
      //
    } catch (error: unknown) {
      // если ошибка данных из запроса
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      // если ошибка бд
      if (error instanceof PrismaError) {
        // если ошибка unique slug
        if (error.code === 'P2002') {
          return res.status(409).json({
            errors: [
              {
                status: '409',
                title: 'Conflict Error',
                detail: 'A category with such slug already exists.'
              }
            ]
          });
        }
        // если ошибка foreign key
        if (error.code === 'P2003') {
          return res.status(400).json({
            errors: [
              {
                status: '404',
                title: 'Not Found Error',
                detail: 'The specified parent category does not exist.'
              }
            ]
          });
        }
        //
        logger.error('CategoryController::create', error);
      }
      //
      return somethingWentWrong(res);
    }
  }

  static async update(req: Request, res: Response) {
    //
    try {
      const paramsSchema = z.object({
        id: z
          .string()
          .transform((v) => parseInt(v, 10))
          .refine((val) => !isNaN(val))
          .refine((val) => val > 0, {
            message: 'Must be a positive number'
          })
      });

      const schema = z
        .object({
          name: z.string().min(1).max(100).optional(),
          slug: z.string().min(1).max(100).optional(),
          parentId: z.number().positive().nullish().optional()
        })
        .refine(
          (data) => data.name || data.slug || data.parentId !== undefined,
          {
            path: ['data']
          }
        );

      const { id } = paramsSchema.parse(req.params);
      const { name, slug, parentId } = schema.parse(req.body);

      const category = await categoryService.updateCategoryById({
        id,
        name,
        slug,
        parentId
      });
      //
      return res.json({
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
      });
      //
    } catch (error: unknown) {
      // если ошибка данных из запроса
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      // если ошибка бд
      if (error instanceof PrismaError) {
        // если id не найдено
        if (error.code === 'P2025') {
          return res.status(404).json({
            errors: [
              {
                status: '404',
                title: 'Not Found Error',
                detail: 'Category with such id doesnt exist.'
              }
            ]
          });
        }
        // если slug занят
        if (error.code === 'P2002') {
          return res.status(409).json({
            errors: [
              {
                status: '409',
                title: 'Conflict Error',
                detail: 'A category with such slug already exists.'
              }
            ]
          });
        }
        // если ошибка foreign key
        if (error.code === 'P2003') {
          return res.status(400).json({
            errors: [
              {
                status: '404',
                title: 'Not Found Error',
                detail: 'The specified parent category does not exist.'
              }
            ]
          });
        }
        //
        logger.error('CategoryController::update', error);
      }
      //
      return somethingWentWrong(res);
    }
  }

  static async delete(req: Request, res: Response) {
    //
    try {
      const schema = z.object({
        id: z
          .string()
          .transform((v) => parseInt(v, 10))
          .refine((val) => !isNaN(val))
          .refine((val) => val > 0, {
            message: 'Must be a positive number'
          })
      });

      const { id } = schema.parse(req.params);

      await categoryService.deleteCategoryById(id);
      //
      return res.status(200).json({});
      //
    } catch (error: unknown) {
      // если ошибка данных из запроса
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      // если ошибка бд
      if (error instanceof PrismaError) {
        // если id не найдено
        if (error.code === 'P2025') {
          return res.status(404).json({
            errors: [
              {
                status: '404',
                title: 'Not Found Error',
                detail: 'Category with such id doesnt exist.'
              }
            ]
          });
        }
        //
        logger.error('CategoryController::delete', error);
      }
      //
      return somethingWentWrong(res);
    }
  }
}
