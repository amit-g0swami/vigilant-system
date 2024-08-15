import { NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { UserRepository } from '../user.interface'
import { HTTP_STATUS_CODE } from '../../../shared'

class UserMiddleware implements UserRepository.IUserMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: UserRepository.IUserMiddlewareRequest,
      res: UserRepository.IUserResponse,
      next: NextFunction
    ) => {
      const { error } = schema.validate(req.body)
      if (error) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          message: error.details[0].message,
          status: HTTP_STATUS_CODE.BAD_REQUEST
        })
      }
      next()
    }
  }
}

export const userMiddleware = new UserMiddleware()
