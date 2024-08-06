import mongoose, { Schema } from 'mongoose'
import { UserRepository } from '../types/user.interface'

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const User = mongoose.model<UserRepository.IUserDataDocument>(
  'User',
  userSchema
)

export default User
