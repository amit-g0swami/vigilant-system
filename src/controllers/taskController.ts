import { Request, Response } from 'express'
import { TaskRepository } from '../types/task.interface'
import { taskService } from '../services/taskService'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from '../types/shared.interface'

class TaskController implements TaskRepository.ITaskController {
  public taskService: TaskRepository.ITaskService

  constructor(taskService: TaskRepository.ITaskService) {
    this.taskService = taskService
  }

  public async createTask(
    req: Request<{}, {}, TaskRepository.ICreateTaskRequestBody>,
    res: Response<TaskRepository.ITaskResponse>
  ): Promise<void> {
    const { title, description, dueDate, priority, assignedTo, createdBy } =
      req.body
    try {
      const task = await taskService.createTask({
        title,
        description,
        dueDate,
        priority,
        assignedTo,
        createdBy
      })
      res.status(HTTP_STATUS_CODE.CREATED).json({
        message: TaskRepository.TASK_MESSAGE.TASK_CREATED,
        status: HTTP_STATUS_CODE.CREATED,
        task
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }

  public async getTaskById(
    req: TaskRepository.ITaskRequest,
    res: Response<TaskRepository.ITaskResponse>
  ): Promise<void> {
    const { taskId } = req.params
    try {
      const task = await taskService.getTaskById(taskId)
      if (!task) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          message: TaskRepository.TASK_MESSAGE.TASK_FETCHED,
          status: HTTP_STATUS_CODE.NOT_FOUND
        })
        return
      }
      res.status(HTTP_STATUS_CODE.OK).json({
        message: TaskRepository.TASK_MESSAGE.TASK_FETCHED,
        status: HTTP_STATUS_CODE.OK,
        task
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export const taskController = new TaskController(taskService)
