import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response, Router } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'

export namespace UserRepository {
  export enum USER_ROLE_TYPE {
    SIMPLE = 'simple',
    ADMIN = 'admin',
    MANAGER = 'manager'
  }

  export enum USER_MESSAGE {
    USER_REGISTERED = 'User registered successfully',
    USER_ALREADY_EXISTS = 'User already exists',
    USER_LOGIN_SUCCESS = 'User logged in successfully',
    USER_LOGOUT_SUCCESS = 'User logged out successfully',
    INVALID_CREDENTIALS = 'Invalid username or password',
    USER_NAME_REQUIRED = 'Username is required',
    EMAIL_REQUIRED = 'Email is required',
    PASSWORD_REQUIRED = 'Password is required'
  }

  export interface IUser {
    username: string
    email: string
    password: string
    role: USER_ROLE_TYPE
    createdAt: Date
    updatedAt: Date
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
    getUser(token: string): Promise<IUserDataDocument>
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
    logoutUserController(
      req: Request,
      res: Response<IUserResponse>
    ): Promise<void>
    getUserController(req: Request, res: Response<IUserResponse>): Promise<void>
  }

  export interface IUserRouter {
    getRouter(): Router
  }

  export enum USER_ENDPOINT {
    REGISTER = '/register',
    LOGIN = '/login',
    LOGOUT = '/logout',
    GET_USER = '/user'
  }
}
