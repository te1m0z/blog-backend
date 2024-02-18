import { z } from 'zod'
import { isSolidInt } from '@/helpers/number'

/* GET : /posts */
const getPostsSchema = z.object({}).strict()

type TGetPostsSchema = z.infer<typeof getPostsSchema>;

/* GET : /posts/:id */
const getPostByIdSchema = z
  .object({
    id: z.string().min(1).refine((val) => isSolidInt(val)).transform((val) => parseInt(val)),
  })
  .strict()

type TGetPostByIdSchema = z.infer<typeof getPostByIdSchema>;

export {
  getPostsSchema,
  TGetPostsSchema,
  getPostByIdSchema,
  TGetPostByIdSchema,
}

