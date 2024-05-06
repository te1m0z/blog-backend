import type { Request, Response } from 'express'
import { ZodError, z } from 'zod'
//
import { getAllPosts, getPostById, createNote } from './note.services'
import { getPostByIdSchema } from './note.validation'
//
import { wrongData, somethingWentWrong, notFound, wrongLoginOrPassword } from '@/helpers/http'

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
    })
    //
    try {
      //
      const { page } = schema.parse(req.query)
      //
      const { notes, total } = await getAllPosts(page)
      //
      return res.json({
        data: notes,
        meta: {
          page,
          total,
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

  static async getById(req: Request, res: Response) {
    //
    try {
      //
      const { id } = getPostByIdSchema.parse(req.params)
      //
      const note = await getPostById(id)
      //
      return res.json({
        data: note,
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
      categoryId: z.number().nonnegative(),
    })
    //
    try {
      //
      const { title, content, categoryId } = schema.parse(req.body)
      //
      const createdNote = await createNote({
        title,
        content,
        categoryId,
      })
      //
      return res.status(200).json({
        data: {
          ...createdNote,
        },
      })
      //
    } catch (error: unknown) {
      //
      if (error instanceof ZodError) {
        return wrongData(res, error.issues)
      }
      //
      return wrongLoginOrPassword(res)
    }
  }
}

export {
  NoteController,
}
