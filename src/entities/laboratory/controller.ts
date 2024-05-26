import type { Request, Response } from 'express'
import { ZodError, z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
//
import { getAllLabs, getLabBySlug, createNote } from './services'
//
import { wrongData, somethingWentWrong, notFound } from '@/helpers/http'

abstract class LaboratoryController {

  static async all(req: Request, res: Response) {
    const schema = z.object({
      page: z.string().nullish().transform((page) => {
        if (!page) {
          return 1
        }

        const parsed = parseInt(page, 10)

        if (isNaN(parsed) || parsed <= 0) {
          return 1
        }

        return parsed
      }),
    })
    //
    try {
      //
      const { page } = schema.parse(req.query)
      //
      const { labs, totalPages, pageSize, totalItems } = await getAllLabs(page)
      //
      return res.json({
        data: labs.map((lab) => ({
          type: 'laboratory',
          id: lab.id,
          attributes: {
            title: lab.title,
            content: lab.content,
            slug: lab.slug,
            published: lab.published,
            createdAt: lab.createdAt,
            updatedAt: lab.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: lab.userId,
              },
            },
          },
        })),
        meta: {
          page,
          totalPages,
          pageSize,
          totalItems,
        },
      })
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      //
      return somethingWentWrong(res)
    }
  }

  static async getBySlug(req: Request, res: Response) {
    const schema = z.object({
      slug: z.string().min(1).max(30),
    })
    //
    try {
      //
      const { slug } = schema.parse(req.params)
      //
      const lab = await getLabBySlug(slug)
      //
      return res.json({
        data: {
          type: 'laboratory',
          id: lab.id,
          attributes: {
            title: lab.title,
            content: lab.content,
            slug: lab.slug,
            published: lab.published,
            createdAt: lab.createdAt,
            updatedAt: lab.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'user',
                id: lab.userId,
              },
            },
          },
        },
      })
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      //
      return notFound(res)
    }
  }

  static async create(req: Request, res: Response) {
    //
    const schema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      slug: z.string().min(1),
      categoryId: z.number().nonnegative(),
    })
    //
    try {
      //
      const { title, content, slug, categoryId } = schema.parse(req.body)
      //
      const createdNote = await createNote({
        title,
        content,
        slug,
        categoryId,
      })
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
            updatedAt: createdNote.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: createdNote.userId,
              },
            },
            category: {
              data: {
                type: 'categories',
                id: createdNote.categoryId,
              },
            },
          },
        },
      })
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          error: 'Database error',
          message: error.message,
          details: error.meta,
        })
      }
      //
      return somethingWentWrong(res)
    }
  }
}

export {
  LaboratoryController,
}
