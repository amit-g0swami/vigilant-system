import { ObjectSchema } from 'joi'
import { NextFunction } from 'express'
import { QueryRepository } from '../query.interface'
import { HTTP_STATUS_CODE } from '../../../shared'

class QueryMiddleware implements QueryRepository.IQueryMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: QueryRepository.IQueryRequest,
      res: QueryRepository.IQueryResponse,
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
