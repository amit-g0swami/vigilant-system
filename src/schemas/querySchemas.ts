import Joi from 'joi'

const createQuerySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  mobileNumber: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
  queryType: Joi.string().required()
})

const querySchemas = {
  createQuerySchema
}

export default querySchemas
