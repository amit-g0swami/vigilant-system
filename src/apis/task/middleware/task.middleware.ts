import { ObjectSchema } from 'joi'
import { NextFunction } from 'express'
import { TaskRepository } from '../task.interface'
import { HTTP_STATUS_CODE } from '../../../shared'

class TaskMiddleware implements TaskRepository.ITaskMiddleware {
  public validate(schema: ObjectSchema) {
    return (
      req: TaskRepository.ICreateTaskRequestBody,
      res: TaskRepository.ITaskResponse,
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
