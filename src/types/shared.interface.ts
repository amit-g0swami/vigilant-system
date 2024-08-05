export enum END_POINT {
  BASE_URL = '/api',
  SWAGGER_URL = '/api-docs'
}

export enum HTTP_STATUS_CODE {
  // eslint-disable-next-line no-magic-numbers
  BAD_REQUEST = 400,
  // eslint-disable-next-line no-magic-numbers
  UNAUTHORIZED = 401,
  // eslint-disable-next-line no-magic-numbers
  FORBIDDEN = 403,
  // eslint-disable-next-line no-magic-numbers
  NOT_FOUND = 404,
  // eslint-disable-next-line no-magic-numbers
  UNPROCESSABLE_ENTITY = 422,
  // eslint-disable-next-line no-magic-numbers
  INTERNAL_SERVER_ERROR = 500,
  // eslint-disable-next-line no-magic-numbers
  SERVICE_UNAVAILABLE = 503,
  // eslint-disable-next-line no-magic-numbers
  GATEWAY_TIMEOUT = 504,
  // eslint-disable-next-line no-magic-numbers
  OK = 200,
  // eslint-disable-next-line no-magic-numbers
  CREATED = 201,
  // eslint-disable-next-line no-magic-numbers
  UPDATED = 200,
  // eslint-disable-next-line no-magic-numbers
  CONFLICT = 409
  // eslint-disable-next-line no-magic-numbers
}

export enum ERROR_MESSAGE {
  INTERNAL_SERVER_ERROR = 'Internal server error',
  VALIDATION_ERROR = 'Validation error',
  USER_NOT_FOUND = 'User not found',
  INVALID_OTP = 'Invalid OTP',
  NOT_AUTHORIZED = 'Not authorized'
}

export const CONSTANTS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10
}
