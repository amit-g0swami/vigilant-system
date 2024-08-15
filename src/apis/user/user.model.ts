import mongoose, { Schema } from 'mongoose'
import { UserRepository } from './user.interface'

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, UserRepository.USER_MESSAGE.USER_NAME_REQUIRED],
    unique: true
  },
  email: {
    type: String,
    required: [true, UserRepository.USER_MESSAGE.EMAIL_REQUIRED],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, UserRepository.USER_MESSAGE.PASSWORD_REQUIRED]
  },
  role: {
    type: String,
    required: true,
    enum: UserRepository.USER_ROLE_TYPE,
    default: UserRepository.USER_ROLE_TYPE.SIMPLE
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model<UserRepository.IUserDataDocument>(
  'User',
  userSchema
)

export default User
