/* eslint-disable no-unused-vars */
export enum RESPONSE_CODES {
  /* Successful 2XX */
  SUCCESS = 200,
  CREATED = 201,
  /* Client errors 4XX */
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  WRONG_DATA = 406,
  /* Server errors 5XX */
  SOMETHING_WENT_WRONG = 500
}

// enum RESPONSE_MESSAGES {
//   SUCCESS = "Succesfully completed",
//   CREATED = "Succesfully created",
//   /* Ошибки 4XX */
//   NOT_ALLOWED = "Not allowed",
//   WRONG_DATA = "Data is not valid",
// }
