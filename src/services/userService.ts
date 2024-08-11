import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { CONSTANTS, ERROR_MESSAGE } from '../types/shared.interface'
import { UserRepository } from '../types/user.interface'
import { emailService } from './mail.Service'

class UserService implements UserRepository.IUserService {
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

    await emailService.sendSignupEmail(email, username)

    return newUser.save()
  }

  public async loginUser(
    usernameOrEmail: string,
    password: string
  ): Promise<UserRepository.ILoginUser> {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error(UserRepository.USER_MESSAGE.INVALID_CREDENTIALS)
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    })

    return { user, token }
  }

  public logoutUser(token: string) {
    // Blacklist the token
    // or delete it from the client-side
    // eslint-disable-next-line no-console
    console.log(token)
  }

  public async getUser(
    token: string
  ): Promise<UserRepository.IUserDataDocument> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await User.findById(decoded.id)
    if (!user) {
      throw new Error(ERROR_MESSAGE.INVALID_USER)
    }
    return user
  }
}

export const userService = new UserService()
