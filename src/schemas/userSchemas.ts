import Joi from 'joi'
import { CONSTANTS } from '../types/shared.interface'

const registerSchema = Joi.object({
  username: Joi.string().min(CONSTANTS.THREE).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(CONSTANTS.EIGHT).required()
})

const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required()
})

const userSchemas = {
  registerSchema,
  loginSchema
}

export default userSchemas
