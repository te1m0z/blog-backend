import { CsrfStorage } from '@/middlewares/csrf'

function generateCsrfToken(userSessionId: string) {
  const csrfTokenData = CsrfStorage.generate(userSessionId)
  //
  return csrfTokenData
}

export {
  generateCsrfToken,
}