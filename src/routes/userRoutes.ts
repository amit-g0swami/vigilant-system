import userSchemas from '../validators/userValidator'
import { Router } from 'express'
import { userController } from '../controllers/userController'
import { userValidator } from '../middleware/validateMiddleware'
import { USER_ENDPOINT } from '../types/user.interface'

const router = Router()

router.post(
  USER_ENDPOINT.REGISTER,
  userValidator.validate(userSchemas.registerSchema),
  userController.registerUserController
)

export default router
