import Task from '../models/Task'
import { TaskRepository } from '../types/task.interface'

class TaskService implements TaskRepository.ITaskService {
  public createTask(
    taskData: TaskRepository.ICreateTaskRequestBody
  ): Promise<TaskRepository.ITask> {
    const task = new Task(taskData)
    return task.save()
  }

  public getTaskById(taskId: string): Promise<TaskRepository.ITask | null> {
    return Task.findById(taskId)
  }
}

export const taskService = new TaskService()
