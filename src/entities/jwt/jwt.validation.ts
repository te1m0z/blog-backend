import { z } from 'zod'
import { toCamelCase } from '@/helpers/string'
//import type { TGeneratePayload } from '@/entities/jwt/jwt.services'

/* POST : /jwt/test */
const createJwtAccessTokenSchema = z.object({
  'user-agent': z.string().min(1),
  'accept-language': z.string().min(1),
  'x-timezone': z.string().min(1),
}).transform((data) => {
  //
  const _data: Record<string, unknown> = {}
  //
  for (const [key, value] of Object.entries(data)) {
    //
    const _key = toCamelCase(key) 
    //
    _data[_key] = value
  }
  //
  return _data
})

//type TGenerateTestJwtSchema = z.infer<typeof generateTestJwtSchema>

export {
  createJwtAccessTokenSchema,
}

