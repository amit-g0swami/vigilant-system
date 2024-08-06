import { Request, Response } from 'express'
import { userService } from '../services/userService'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from '../types/shared.interface'
import { UserRepository } from '../types/user.interface'

class UserController implements UserRepository.IUserController {
  private userService: UserRepository.IUserService

  constructor(userService: UserRepository.IUserService) {
    this.userService = userService
  }

  public registerUserController = async (
    req: Request<{}, {}, UserRepository.IRegisterRequestBody>,
    res: Response<UserRepository.IUserResponse>
  ): Promise<void> => {
    const { username, email, password } = req.body

    try {
      const result = await this.userService.registerUser(
        username,
        email,
        password
      )
      res.status(HTTP_STATUS_CODE.CREATED).json({
        message: UserRepository.USER_MESSAGE.USER_REGISTERED,
        status: HTTP_STATUS_CODE.CREATED,
        user: result
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.BAD_REQUEST
      })
    }
  }

  public loginUserController = async (
    req: Request<{}, {}, UserRepository.ILoginRequestBody>,
    res: Response<UserRepository.IUserResponse>
  ): Promise<void> => {
    const { usernameOrEmail, password } = req.body

    try {
      const { user, token } = await this.userService.loginUser(
        usernameOrEmail,
        password
      )
      res.status(HTTP_STATUS_CODE.OK).json({
        message: UserRepository.USER_MESSAGE.USER_LOGIN_SUCCESS,
        status: HTTP_STATUS_CODE.OK,
        user,
        token
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.BAD_REQUEST
      })
    }
  }

  public logoutUserController = async (
    req: Request,
    res: Response<UserRepository.IUserResponse>
  ): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: ERROR_MESSAGE.INVALID_TOKEN,
        status: HTTP_STATUS_CODE.BAD_REQUEST
      })
      return
    }

    try {
      await this.userService.logoutUser(token)
      res.status(HTTP_STATUS_CODE.OK).json({
        message: UserRepository.USER_MESSAGE.USER_LOGOUT_SUCCESS,
        status: HTTP_STATUS_CODE.OK
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }

  public getUserController = async (
    req: Request,
    res: Response<UserRepository.IUserResponse>
  ): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: ERROR_MESSAGE.INVALID_TOKEN,
        status: HTTP_STATUS_CODE.BAD_REQUEST
      })
      return
    }

    try {
      const user = await this.userService.getUser(token)
      res.status(HTTP_STATUS_CODE.OK).json({
        message: UserRepository.USER_MESSAGE.USER_LOGOUT_SUCCESS,
        status: HTTP_STATUS_CODE.OK,
        user: user
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export const userController = new UserController(userService)
