import userSchemas from '../schemas/userSchemas'
import { Router } from 'express'
import { userController } from '../controllers/userController'
import { USER_ENDPOINT } from '../types/user.interface'
import { userMiddleware } from '../middleware/userMiddleware'

const router = Router()

router.post(
  USER_ENDPOINT.REGISTER,
  userMiddleware.validate(userSchemas.registerSchema),
  userController.registerUserController
)

export default router
