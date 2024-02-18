import { z } from 'zod'

/* POST : /user/login */
const userLoginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
})

type TUserLoginSchema = z.infer<typeof userLoginSchema>;

export {
  userLoginSchema,
  TUserLoginSchema,
}
