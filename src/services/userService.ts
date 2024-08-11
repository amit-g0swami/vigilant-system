import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { CONSTANTS, ERROR_MESSAGE } from '../types/shared.interface'
import { UserRepository } from '../types/user.interface'
import { emailService } from './mail.Service'
import { Logger } from '../logger/logger.lib'

class UserService implements UserRepository.IUserService {
  private _getUserByEmail(
    email: string
  ): Promise<UserRepository.IUserDataDocument | null> {
    return User.findOne({ email })
  }

  private _getUserByUsername(
    username: string
  ): Promise<UserRepository.IUserDataDocument | null> {
    return User.findOne({ username })
  }

  private _findUserById(
    id: string
  ): Promise<UserRepository.IUserDataDocument | null> {
    return User.findById(id)
  }

  private _findUserByUsername(
    usernameOrEmail: string
  ): Promise<UserRepository.IUserDataDocument | null> {
    return User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })
  }

  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<UserRepository.IUserDataDocument> {
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      this._getUserByEmail(email),
      this._getUserByUsername(username)
    ])

    if (existingUserByEmail || existingUserByUsername) {
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
    const user = await this._findUserByUsername(usernameOrEmail)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error(UserRepository.USER_MESSAGE.INVALID_CREDENTIALS)
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    })

    return { user, token }
  }

  public logoutUser(token: string) {
    Logger.info(token)
  }

  public async getUser(
    token: string
  ): Promise<UserRepository.IUserDataDocument> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await this._findUserById(decoded.id)
    if (!user) {
      throw new Error(ERROR_MESSAGE.INVALID_USER)
    }
    return user
  }
}

export const userService = new UserService()
