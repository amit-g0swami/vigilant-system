import rateLimit from 'express-rate-limit'
import userSchemas from '../schemas/userSchemas'
import { Router, Request } from 'express'
import { UserRepository } from '../types/user.interface'
import { authenticateJWT } from '../middleware/jwtMiddleware'
import { userController } from '../controllers/userController'
import { userMiddleware } from '../middleware/userMiddleware'

class UserRouter implements UserRepository.IUserRouter {
  private router: Router
  private userController: UserRepository.IUserController
  private userMiddleware: UserRepository.IUserMiddleware

  constructor() {
    this.router = Router()
    this.userController = userController
    this.userMiddleware = userMiddleware
    this.initializeRoutes()
  }

  private initializeRoutes() {
    const loginRateLimiter = rateLimit({
      // eslint-disable-next-line no-magic-numbers
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 login requests per windowMs
      message: 'Too many login attempts from this IP, please try again later'
    })

    this.router.post(
      UserRepository.USER_ENDPOINT.REGISTER,
      this.userMiddleware.validate(userSchemas.registerSchema),
      (req: Request<{}, {}, UserRepository.IRegisterRequestBody>, res) =>
        this.userController.registerUserController(req, res)
    )

    this.router.post(
      UserRepository.USER_ENDPOINT.LOGIN,
      loginRateLimiter,
      this.userMiddleware.validate(userSchemas.loginSchema),
      (req, res) => this.userController.loginUserController(req, res)
    )

    this.router.post(UserRepository.USER_ENDPOINT.LOGOUT, (req, res) =>
      this.userController.logoutUserController(req, res)
    )

    this.router.get(
      UserRepository.USER_ENDPOINT.GET_USER,
      authenticateJWT,
      (req, res) => this.userController.getUserController(req, res)
    )
  }

  public getRouter() {
    return this.router
  }
}

export const userRouter = new UserRouter()
