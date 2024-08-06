import { ObjectSchema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS_CODE } from '../types/shared.interface'
import { QueryRepository } from '../types/query.interface'

class QueryMiddleware implements QueryRepository.IQueryMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: Request<QueryRepository.IQueryRequestBody>,
      res: Response<QueryRepository.IQueryResponse>,
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

export const queryMiddleware = new QueryMiddleware()
