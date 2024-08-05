import bcrypt from 'bcryptjs'
import User from '../models/User'
import { IUserService } from '../types/user.interface'
import { CONSTANTS } from '../types/shared.interface'

export class UserService implements IUserService {
  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, CONSTANTS.TEN)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    await newUser.save()
  }
}
