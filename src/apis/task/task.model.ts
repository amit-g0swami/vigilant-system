import mongoose from 'mongoose'
import { TaskRepository } from './task.interface'

const { Schema } = mongoose

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, required: true, maxlength: 500 },
  dueDate: { type: Date, required: true },
  priority: {
    type: String,
    enum: TaskRepository.TASK_PRIORITY_TYPE,
    default: TaskRepository.TASK_PRIORITY_TYPE.LOW
  },
  status: {
    type: String,
    enum: Object.values(TaskRepository.TASK_STATUS),
    default: TaskRepository.TASK_STATUS.PENDING
  },
  assignedTo: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Task = mongoose.model<TaskRepository.ITask>('task', taskSchema)

export default Task
