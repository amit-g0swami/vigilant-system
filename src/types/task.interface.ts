import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response, Router } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'

export namespace TaskRepository {
  export enum TASK_MESSAGE {
    TASK_CREATED = 'Task created successfully',
    TASK_FETCHED = 'Task fetched successfully'
  }

  export enum TASK_STATUS {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed'
  }

  export enum TASK_PRIORITY_TYPE {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
  }

  export const CONSTANTS = {
    MAX_DESCRIPTION_LENGTH: 500
  }

  export interface ICreateTaskRequestBody {
    title: string
    description: string
    dueDate: Date
    priority: TASK_PRIORITY_TYPE
    assignedTo?: string
    createdBy: string
  }

  export interface ITask extends Document {
    title: string
    description: string
    dueDate: Date
    priority: TASK_PRIORITY_TYPE
    status: TASK_STATUS
    assignedTo?: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
  }

  type IBaseTaskMessage = string
  type ITaskMessage = TASK_MESSAGE | ERROR_MESSAGE | IBaseTaskMessage

  export interface ITaskRequest extends Request {
    params: {
      taskId: string
    }
  }

  export interface ITaskResponse {
    message: ITaskMessage
    status: HTTP_STATUS_CODE
    task?: ITask | ITask[]
  }

  export interface ITaskMiddleware {
    validate(
      schema: ObjectSchema
    ): (
      req: Request<{}, {}, ICreateTaskRequestBody>,
      res: Response<ITaskResponse>,
      next: NextFunction
    ) => void
  }

  export interface ITaskService {
    createTask(taskData: ICreateTaskRequestBody): Promise<ITask>
    getTaskById(taskId: string): Promise<ITask | null>
  }

  export interface ITaskController {
    createTask(req: Request, res: Response<ITaskResponse>): Promise<void>
    getTaskById(req: Request, res: Response<ITaskResponse>): Promise<void>
  }

  export interface ITaskRouter {
    getRouter(): Router
  }

  export enum TASK_ROUTE {
    CREATE_TASK = '/task',
    GET_TASK_BY_ID = '/task/:taskId'
  }
}
