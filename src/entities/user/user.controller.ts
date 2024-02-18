import type { Request, Response } from 'express'
import { ZodError } from 'zod'
//
import { userLogin } from './user.services'
import { userLoginSchema } from './user.validation'
//
import { somethingWentWrong, wrongData, wrongLoginOrPassword } from '@/helpers/http'
import { isAccessTokenValid, parseAccessToken } from '@/entities/jwt/jwt.services'
import { prisma } from '@/prisma/client'

abstract class UserController {
  //
  static async login(req: Request, res: Response) {
    //
    try {
      //
      const { fingerprint } = req
      //
      if (!fingerprint) throw 'login cannot be continued'
      //
      const { login, password } = userLoginSchema.parse(req.body)
      //
      const userDataWithTokens = await userLogin({
        login,
        password,
        fingerprint,
      })
      //
      return res.status(200).json({
        status: true,
        data: userDataWithTokens,
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

  static async getUser(req: Request, res: Response) {
    try {
      if (!req.accessToken) {
        throw null
      }

      const data = parseAccessToken(req.accessToken)

      if (!data || !data.sub) {
        throw null
      }

      const id = Number(data.sub)

      const user = await prisma.user.findUniqueOrThrow({ where: { id } })

      return res.status(200).json({
        status: true,
        data: {
          id: user.id,
          login: user.login,
        },
      })
    } catch (error: unknown) {
      return somethingWentWrong(res)
    }
  }
}

export {
  UserController,
}
