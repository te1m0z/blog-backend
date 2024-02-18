import { prisma } from '@/prisma/client'
import { compareSync } from 'bcrypt'
import { createAccessToken } from '@/entities/jwt/jwt.services'


type TUserLoginArgs = {
    login: string
    password: string
    fingerprint: string
}

async function userLogin(args: TUserLoginArgs) {
  //
  const { login, password, fingerprint } = args
  // Try to get user from db, otherwise throw error
  const user = await prisma.user.findUniqueOrThrow({ where: { login } })
  // Compare original password with hashed in db
  const isPasswordsMatch = compareSync(password, user.password)
  //
  if (!isPasswordsMatch) throw null
  // Creating Access and Refresh tokens
  const tokens = await createAccessToken({
    sub: String(user.id),
    iss: 'login',
    fingerprint,
  })
  // Preparing data to get back to client's browser
  return {
    id: user.id,
    login: user.login,
    ...tokens,
  }
}

export {
  userLogin,
}