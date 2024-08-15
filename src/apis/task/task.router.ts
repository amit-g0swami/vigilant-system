import taskSchemas from './task.schema'
import { Router } from 'express'
import { TaskRepository } from './task.interface'
import { taskController } from './task.controller'
import { taskMiddleware } from './middleware'

class TaskRouter implements TaskRepository.ITaskRouter {
  private router: TaskRepository.IBaseTaskRouter
  private taskController: TaskRepository.ITaskController
  private taskMiddleware: TaskRepository.ITaskMiddleware

  constructor() {
    this.router = Router()
    this.taskController = taskController
    this.taskMiddleware = taskMiddleware
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      TaskRepository.TASK_ROUTE.CREATE_TASK,
      this.taskMiddleware.validate(taskSchemas.createTaskSchema),
      (req, res) => this.taskController.createTask(req, res)
    )

    this.router.get(TaskRepository.TASK_ROUTE.GET_TASK_BY_ID, (req, res) =>
      this.taskController.getTaskById(req, res)
    )
  }

  public getRouter() {
    return this.router
  }
}

export const taskRouter = new TaskRouter()
