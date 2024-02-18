import { z } from 'zod'

const generateCsrfSchema = z.object({}).strict()

type TGenerateCsrfSchema = z.infer<typeof generateCsrfSchema>;

export {
  generateCsrfSchema,
  TGenerateCsrfSchema,
}

