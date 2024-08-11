import Joi from 'joi'
import { TaskRepository } from '../types/task.interface'

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string()
    .max(TaskRepository.CONSTANTS.MAX_DESCRIPTION_LENGTH)
    .required(),
  dueDate: Joi.date().required(),
  priority: Joi.string()
    .valid(TaskRepository.TASK_PRIORITY_TYPE)
    .default(TaskRepository.TASK_PRIORITY_TYPE.MEDIUM),
  assignedTo: Joi.string().optional(),
  createdBy: Joi.string().required()
})

const taskSchemas = {
  createTaskSchema
}

export default taskSchemas
