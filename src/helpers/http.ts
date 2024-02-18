import type { Response } from 'express'
import type { ZodIssue } from 'zod'
import { RESPONSE_CODES } from '@/constants/http'
import type { THeader } from '@/interfaces/http'

/**
 * Sets the server response headers
 *
 * @param {NextApiResponse} response - Server response
 * @param {THeader[]} headers - Set of server response headers
 */
function setHeaders(response: Response, headers: THeader[]) {
  for (const { name, value } of headers) {
    response.setHeader(name, value)
  }
}

/**
 * Error display when CORS violation occurs
 *
 * @param {NextApiResponse} response - Server response
 */
function methodNotAllowed(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.METHOD_NOT_ALLOWED).json(payload)
}

/**
 * Error display when client sends incorrect data format
 *
 * @param {NextApiResponse} response - Server response
 */
function wrongData(response: Response, issues?: ZodIssue[]) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
    errors: issues?.reduce((acc, { message, path }) => {
      acc[path.join('.')] = message
      return acc
    }, {} as Record<string, string>),
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.WRONG_DATA).json(payload)
}

/**
 * Error display when client sends incorrect login data
 *
 * @param {NextApiResponse} response - Server response
 */
function wrongLoginOrPassword(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
    errors: {
      login: 'wrong login or password',
      password: 'wrong login or password',
    },
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.WRONG_DATA).json(payload)
}

/**
 * Error display when client requesting the resource which doesnt exist
 *
 * @param {NextApiResponse} response - Server response
 */
function notFound(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.NOT_FOUND).json(payload)
}

/**
 * Error display when something has gone wrong
 *
 * @param {NextApiResponse} response - Server response
 */
function somethingWentWrong(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.SOMETHING_WENT_WRONG).json(payload)
}

function csrfValidationFailed(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
    errors: {
      csrf: 'not valid',
    },
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.WRONG_DATA).json(payload)
}

function authorizationFailed(response: Response) {
  // Set of headers corresponding to server response
  const headers: THeader[] = []
  // Data in the response from the server
  const payload = {
    status: false,
  }
  // Setting headers for the response
  setHeaders(response, headers)
  // Set response status code and print json
  response.status(RESPONSE_CODES.UNAUTHORIZED).json(payload)
}

export {
  methodNotAllowed,
  wrongData,
  wrongLoginOrPassword,
  notFound,
  somethingWentWrong,
  csrfValidationFailed,
  authorizationFailed,
}

// class CustomResponse {
//     private static instance: CustomResponse;
//     private constructor() {}
//     static getInstance(): CustomResponse {
//       if (!CustomResponse.instance) {
//         CustomResponse.instance = new CustomResponse();
//       }
//       return CustomResponse.instance;
//     }
//     methodNotAllowed(): IServerResponse {
//       return {
//         status: false,
//         message: 'Method not allowed',
//       }
//     }
//   }

// 200, 404, 301, 302, 500, 403 - ssr
// entityUser
// axios.global.catch((err) => {
// if (errr.status === 500) alrt(...)
// if (errr.status === 408) alrt(...)// dadada
// if (errr.status === 404) alrt(...)
// if (errr.status === 403) alrt(...) //
//})

// signInWithLoginAndPassword() {
//   axios('dada')
//   .then((res) => {
//     if (res.code === 200) {  }
//   })
//   .catch(({ errors }) => {

// 406 валидация
//
// if (errr.status === 406) errors.forEach( this.globalAlert(err.message)
//     if (err.code === 406) { errors.forEach( this.globalAlert(err.message) )
// this.globalAlert('Somethign went wrong')
// }
//   })
// }

