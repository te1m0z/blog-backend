import type { Request, Response } from 'express'
import { z, ZodError } from 'zod'
//
import { prisma } from '@/config/prisma'
import { userService, jwtService } from '@/services'
import { somethingWentWrong, wrongData, wrongLoginOrPassword } from '@/helpers/http'

export abstract class UserController {
  static async login(req: Request, res: Response) {
    try {
      const schema = z.object({
        login: z.string().min(1),
        password: z.string().min(1),
      })
      //
      const fingerprint = req.fingerprint!
      //
      const { login, password } = schema.parse(req.body)
      //
      const userDataWithTokens = await userService.userLogin({
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

      const data = jwtService.parseAccessToken(req.accessToken)

      if (!data || !data.sub) {
        throw null
      }

      const id = Number(data.sub)

      const user = await prisma.user.findUniqueOrThrow({ where: { id } })

      return res.status(200).json({
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            login: user.login,
          },
        },
      })
    } catch (error: unknown) {
      return somethingWentWrong(res)
    }
  }

  static async getNewAccessToken(req: Request, res: Response) {
    //
    try {
      //
      const { access_token } = await jwtService.createAccessToken({
        sub: String(req.userId),
        iss: 'regenerate_access',
      })
      //
      return res.status(200).json({
        data: {
          type: 'tokens',
          attributes: {
            access_token,
          },
        },
      })
      //
    } catch {
      return somethingWentWrong(res)
    }
  }
}
