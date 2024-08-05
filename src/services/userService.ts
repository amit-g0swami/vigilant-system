import bcrypt from 'bcryptjs'
import User from '../models/User'
import {
  IUserDataDocument,
  IUserService,
  USER_MESSAGE
} from '../types/user.interface'
import { CONSTANTS } from '../types/shared.interface'

export class UserService implements IUserService {
  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<IUserDataDocument> {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error(USER_MESSAGE.USER_ALREADY_EXISTS)
    }

    const hashedPassword = await bcrypt.hash(password, CONSTANTS.TEN)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    return newUser.save()
  }
}
