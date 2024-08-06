import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'

export namespace UserRepository {
  export enum USER_MESSAGE {
    USER_REGISTERED = 'User registered successfully',
    USER_ALREADY_EXISTS = 'User already exists',
    USER_LOGIN_SUCCESS = 'User logged in successfully',
    USER_LOGOUT_SUCCESS = 'User logged out successfully',
    INVALID_CREDENTIALS = 'Invalid username or password'
  }

  export interface IUser {
    username: string
    email: string
    password: string
  }

  export interface IRegisterRequestBody extends IUser {}
  export interface ILoginRequestBody {
    usernameOrEmail: string
    password: string
  }

  export interface IUserDataDocument extends IUser, Document {}

  type IBaseUserMessage = string

  type IUserMessage = USER_MESSAGE | ERROR_MESSAGE | IBaseUserMessage

  export interface ILoginUser {
    user: IUserDataDocument
    token: string
  }

  export interface IUserResponse {
    message: IUserMessage
    status: HTTP_STATUS_CODE
    user?: IUserDataDocument
    token?: string
  }

  export interface IUserService {
    registerUser(
      username: string,
      email: string,
      password: string
    ): Promise<IUserDataDocument>
    loginUser(usernameOrEmail: string, password: string): Promise<ILoginUser>
    logoutUser(token: string): void
  }

  export interface IUserMiddleware {
    validate(
      schema: ObjectSchema
    ): (
      req: Request<{}, {}, IRegisterRequestBody | ILoginRequestBody>,
      res: Response<IUserResponse>,
      next: NextFunction
    ) => void
  }

  export interface IUserController {
    registerUserController(
      req: Request<{}, {}, IRegisterRequestBody>,
      res: Response<IUserResponse>
    ): Promise<void>
    loginUserController(
      req: Request<{}, {}, ILoginRequestBody>,
      res: Response<IUserResponse>
    ): Promise<void>
    logoutUserController(req: Request, res: Response<IUserResponse>): void
  }

  export enum USER_ENDPOINT {
    REGISTER = '/register',
    LOGIN = '/login',
    LOGOUT = '/logout'
  }
}
