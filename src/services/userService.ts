import bcrypt from 'bcryptjs'
import User from '../models/User'
import { CONSTANTS } from '../types/shared.interface'
import { UserRepository } from '../types/user.interface'

export class UserService implements UserRepository.IUserService {
  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<UserRepository.IUserDataDocument> {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error(UserRepository.USER_MESSAGE.USER_ALREADY_EXISTS)
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
