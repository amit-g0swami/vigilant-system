import Task from './task.model'
import { RedisClientType } from 'redis'
import { TaskRepository } from './task.interface'
import { redisConnector } from '../../config'

class TaskService implements TaskRepository.ITaskService {
  private redisClient: RedisClientType

  constructor() {
    this.redisClient = redisConnector.getClient()
  }

  private _findTaskById(taskId: string): Promise<TaskRepository.ITask | null> {
    return Task.findById(taskId)
  }

  public createTask(
    taskData: TaskRepository.ICreateTaskRequestBodyDTO
  ): Promise<TaskRepository.ITask> {
    const task = new Task(taskData)
    return task.save()
  }

  public async getTaskById(
    taskId: string
  ): Promise<TaskRepository.ITask | null> {
    const cachedTask = await this.redisClient.get(`task:${taskId}`)
    if (cachedTask) {
      return JSON.parse(cachedTask)
    }

    const task = await this._findTaskById(taskId)

    if (task) {
      await this.redisClient.set(`task:${taskId}`, JSON.stringify(task))
    }

    return task
  }
}

export const taskService = new TaskService()
