import userSchemas from '../schemas/userSchemas'
import { Router } from 'express'
import { userController } from '../controllers/userController'
import { userMiddleware } from '../middleware/userMiddleware'
import { UserRepository } from '../types/user.interface'

const router = Router()

router.post(
  UserRepository.USER_ENDPOINT.REGISTER,
  userMiddleware.validate(userSchemas.registerSchema),
  userController.registerUserController
)

export default router
