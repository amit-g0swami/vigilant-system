import { ObjectSchema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS_CODE } from '../types/shared.interface'
import { TaskRepository } from '../types/task.interface'

class TaskMiddleware implements TaskRepository.ITaskMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: Request<TaskRepository.ICreateTaskRequestBody>,
      res: Response<TaskRepository.ITaskResponse>,
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

export const taskMiddleware = new TaskMiddleware()
