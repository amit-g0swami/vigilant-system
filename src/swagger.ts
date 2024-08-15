import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import { END_POINT } from './shared'

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.ts']
})

export const setupSwagger = (app: Application) => {
  app.use(END_POINT.SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
