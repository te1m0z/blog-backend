import type { Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/library';
//
import { noteService } from '@/services';
//
import { wrongData, somethingWentWrong, notFound } from '@/helpers/http';
import { logger } from '@/utils';

export abstract class NoteController {
  static async all(req: Request, res: Response) {
    const schema = z.object({
      page: z
        .string()
        .nullish()
        .transform((page) => {
          if (!page) {
            return 1;
          }

          const parsed = parseInt(page, 10);

          if (isNaN(parsed) || parsed <= 0) {
            return 1;
          }

          return parsed;
        }),
      category: z.string().nullish()
    });
    //
    try {
      //
      const { page, category } = schema.parse(req.query);
      //
      const { notes, totalPages, pageSize, totalItems } =
        await noteService.getAllPosts(page, category);
      //
      return res.json({
        data: notes.map((note) => ({
          type: 'notes',
          id: note.id,
          attributes: {
            title: note.title,
            content: note.content,
            slug: note.slug,
            published: note.published,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: note.userId
              }
            },
            category: {
              data: {
                type: 'categories',
                id: note.categoryId
              }
            }
          }
        })),
        meta: {
          page,
          totalPages,
          pageSize,
          totalItems
        }
      });
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      //
      return somethingWentWrong(res);
    }
  }

  static async getBySlug(req: Request, res: Response) {
    //
    try {
      const schema = z
        .object({
          slug: z.string().min(1).max(100)
          // id: z.string().min(1).refine((val) => isSolidInt(val)).transform((val) => parseInt(val)),
        })
        .strict();
      //
      const { slug } = schema.parse(req.params);
      //
      const note = await noteService.getPostBySlug(slug);
      //
      return res.json({
        data: {
          type: 'note',
          id: note.id,
          attributes: {
            title: note.title,
            content: note.content,
            slug: note.slug,
            published: note.published,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
          },
          relationships: {
            user: {
              data: {
                type: 'user',
                id: note.userId
              }
            },
            category: {
              data: {
                type: 'category',
                id: note.categoryId
              }
            }
          }
        }
      });
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
    const schema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      slug: z.string().min(1)
    });
    //
    try {
      //
      const { title, content, slug } = schema.parse(req.body);
      //
      const createdNote = await noteService.createNote({
        title,
        content,
        slug
      });
      //
      return res.status(201).json({
        data: {
          type: 'notes',
          id: createdNote.id,
          attributes: {
            title: createdNote.title,
            content: createdNote.content,
            slug: createdNote.slug,
            published: createdNote.published,
            createdAt: createdNote.createdAt,
            updatedAt: createdNote.updatedAt
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: createdNote.userId
              }
            },
            category: {
              data: {
                type: 'categories',
                id: createdNote.categoryId
              }
            }
          }
        }
      });
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues);
      }
      if (error instanceof PrismaError) {
        return res.status(500).json({
          error: 'Database error',
          message: error.message,
          details: error.meta
        });
      }
      //
      return somethingWentWrong(res);
    }
  }

  static async update(req: Request, res: Response) {
    //
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
      //
      const schema = z
        .object({
          title: z.string().min(1).optional(),
          content: z.string().min(1).optional(),
          slug: z.string().max(100).optional(),
          categoryId: z.number().positive().optional()
        })
        .refine(
          (data) => data.title || data.slug || data.content || data.categoryId,
          {
            path: ['data']
          }
        );
      //
      const { id } = paramsSchema.parse(req.params);
      const { title, content, slug, categoryId } = schema.parse(req.body);
      //
      const updatedNote = await noteService.updateNoteById({
        id,
        title,
        content,
        slug,
        categoryId
      });
      //
      return res.status(200).json({
        data: {
          type: 'note',
          id: updatedNote.id,
          attributes: {
            title: updatedNote.title,
            content: updatedNote.content,
            slug: updatedNote.slug,
            published: updatedNote.published,
            createdAt: updatedNote.createdAt,
            updatedAt: updatedNote.updatedAt
          },
          relationships: {
            user: {
              data: {
                type: 'user',
                id: updatedNote.userId
              }
            },
            category: {
              data: {
                type: 'category',
                id: updatedNote.categoryId
              }
            }
          }
        }
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
                detail: 'Note with such id doesnt exist.'
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
                detail: 'A note with such slug already exists.'
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
                detail: 'The specified note category does not exist.'
              }
            ]
          });
        }
        //
        logger.error('CategoryController::update', error);
        //
      }
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
      //
      const { id } = schema.parse(req.params);
      //
      await noteService.deleteNoteById(id);
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
                detail: 'Note with such id doesnt exist.'
              }
            ]
          });
        }
        //
        logger.error('CategoryController::delete', error);
        //
      }

      return somethingWentWrong(res);
    }
  }
}
