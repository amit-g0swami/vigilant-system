import Task from '../models/Task'
import { redisConnector } from '../config/redisClient'
import { TaskRepository } from '../types/task.interface'
import { RedisClientType } from 'redis'

class TaskService implements TaskRepository.ITaskService {
  private redisClient: RedisClientType

  constructor() {
    this.redisClient = redisConnector.getClient()
  }

  public createTask(
    taskData: TaskRepository.ICreateTaskRequestBody
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

    const task = Task.findById(taskId)
    if (task) {
      await this.redisClient.set(`task:${taskId}`, JSON.stringify(task))
    }

    return task
  }
}

export const taskService = new TaskService()
