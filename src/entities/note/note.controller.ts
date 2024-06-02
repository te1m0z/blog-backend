import type { Request, Response } from 'express'
import { ZodError, z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
//
import { getAllPosts, getPostBySlug, createNote, updateNoteBySlug } from './note.services'
import { getPostByIdSchema } from './note.validation'
//
import { wrongData, somethingWentWrong, notFound } from '@/helpers/http'

abstract class NoteController {

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
      category: z.string().nullish(),
    })
    //
    try {
      //
      const { page, category } = schema.parse(req.query)
      //
      const { notes, totalPages, pageSize, totalItems } = await getAllPosts(page, category)
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
            updatedAt: note.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: note.userId,
              },
            },
            category: {
              data: {
                type: 'categories',
                id: note.categoryId,
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
    //
    try {
      //
      const { slug } = getPostByIdSchema.parse(req.params)
      //
      const note = await getPostBySlug(slug)
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
            updatedAt: note.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'user',
                id: note.userId,
              },
            },
            category: {
              data: {
                type: 'category',
                id: note.categoryId,
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
      // categoryId: z.number().nonnegative(),
    })
    //
    try {
      //
      const { title, content, slug } = schema.parse(req.body)
      //
      const createdNote = await createNote({
        title,
        content,
        slug
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

  static async update(req: Request, res: Response) {
    //
    const schema = z.object({
      slug: z.string().max(100),
      title: z.string().min(1),
      content: z.string().min(1),
    })
    //
    try {
      //
      const { slug, title, content } = schema.parse(req.body)
      //
      const updatedNote = await updateNoteBySlug(slug, {
        title,
        content,
      })
      //
      return res.status(200).json({
        data: {
          type: 'notes',
          id: updatedNote.id,
          attributes: {
            title: updatedNote.title,
            content: updatedNote.content,
            slug: updatedNote.slug,
            published: updatedNote.published,
            createdAt: updatedNote.createdAt,
            updatedAt: updatedNote.updatedAt,
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: updatedNote.userId,
              },
            },
            category: {
              data: {
                type: 'categories',
                id: updatedNote.categoryId,
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
  NoteController,
}
