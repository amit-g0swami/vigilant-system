import { Request, Response } from 'express'
import { UserService } from '../services/userService'
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
}

const userService = new UserService()
export const userController = new UserController(userService)
