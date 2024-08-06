import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'

export namespace UserRepository {
  export enum USER_MESSAGE {
    USER_REGISTERED = 'User registered successfully',
    USER_ALREADY_EXISTS = 'User already exists'
  }

  export interface IUser {
    username: string
    email: string
    password: string
  }

  export interface IRegisterRequestBody extends IUser {}

  export interface IUserDataDocument extends IUser, Document {}

  type IBaseUserMessage = string

  type IUserMessage = USER_MESSAGE | ERROR_MESSAGE | IBaseUserMessage

  export interface IUserResponse {
    message: IUserMessage
    status?: HTTP_STATUS_CODE
    user?: IUserDataDocument
  }

  export interface IUserService {
    registerUser(
      username: string,
      email: string,
      password: string
    ): Promise<IUserDataDocument>
  }

  export interface IUserMiddleware {
    validate(
      schema: ObjectSchema
    ): (
      req: Request<IRegisterRequestBody>,
      res: Response<IUserResponse>,
      next: NextFunction
    ) => void
  }

  export interface IUserController {
    registerUserController(
      req: Request<{}, {}, IRegisterRequestBody>,
      res: Response<IUserResponse>
    ): Promise<void>
  }

  export enum USER_ENDPOINT {
    REGISTER = '/register'
  }
}
