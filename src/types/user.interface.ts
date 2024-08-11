import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response, Router } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'

export namespace UserRepository {
  type IBaseUserMessage = string
  type IUserMessage = USER_MESSAGE | ERROR_MESSAGE | IBaseUserMessage
  type IEmptyObject = {}

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

  export interface IUserLoginBody {
    usernameOrEmail: string
    password: string
  }
  export interface IUserBaseHeader {
    authorization: string
  }
  export interface IRegisterRequestBody
    extends IUser,
      Request<IEmptyObject, IEmptyObject, IUser> {}
  export interface IGetUserInfoHeader
    extends Request<IEmptyObject, IEmptyObject, IUserBaseHeader> {}
  export interface ILoginRequestBody
    extends Request<IEmptyObject, IEmptyObject, IUserLoginBody> {}
  export interface IUserDataDocument extends IUser, Document {}

  export type IUserBaseRouter = Router
  export type IUserMiddlewareRequest = IRegisterRequestBody

  export interface ILoginUser {
    user: IUserDataDocument
    token: string
  }

  export interface IRegisterUserResponse {
    message: IUserMessage
    status: HTTP_STATUS_CODE
    user?: IUserDataDocument
    token?: string
  }

  export interface ILogoutUserRequest
    extends Request<IEmptyObject, IEmptyObject, IUserBaseHeader> {}

  export interface IUserResponse
    extends Response<IRegisterUserResponse | ILoginUser | IUserDataDocument> {}

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
      req: IUserMiddlewareRequest,
      res: IUserResponse,
      next: NextFunction
    ) => void
  }

  export interface IUserController {
    registerUserController(
      req: IRegisterRequestBody,
      res: IUserResponse
    ): Promise<void>
    loginUserController(
      req: ILoginRequestBody,
      res: IUserResponse
    ): Promise<void>
    logoutUserController(
      req: ILogoutUserRequest,
      res: IUserResponse
    ): Promise<void>
    getUserController(
      req: IGetUserInfoHeader,
      res: IUserResponse
    ): Promise<void>
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
