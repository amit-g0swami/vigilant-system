import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { HTTP_STATUS_CODE } from '../types/shared.interface'
import { UserRepository } from '../types/user.interface'

class UserMiddleware implements UserRepository.IUserMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: Request<UserRepository.IRegisterRequestBody>,
      res: Response<UserRepository.IUserResponse>,
      next: NextFunction
    ) => {
      const { error } = schema.validate(req.body)
      if (error) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ message: error.details[0].message })
      }
      next()
    }
  }
}

export const userMiddleware = new UserMiddleware()
