import rateLimit from 'express-rate-limit'
import userSchemas from '../schemas/userSchemas'
import { Router } from 'express'
import { userController } from '../controllers/userController'
import { userMiddleware } from '../middleware/userMiddleware'
import { UserRepository } from '../types/user.interface'

const router = Router()

const loginRateLimiter = rateLimit({
  // eslint-disable-next-line no-magic-numbers
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again later'
})

router.post(
  UserRepository.USER_ENDPOINT.REGISTER,
  userMiddleware.validate(userSchemas.registerSchema),
  userController.registerUserController
)

router.post(
  UserRepository.USER_ENDPOINT.LOGIN,
  loginRateLimiter,
  userMiddleware.validate(userSchemas.loginSchema),
  userController.loginUserController
)

router.post(
  UserRepository.USER_ENDPOINT.LOGOUT,
  userController.logoutUserController
)

export default router
