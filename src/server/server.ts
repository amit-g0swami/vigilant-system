import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupSwagger } from '../swagger'
import { Logger } from '../logger/logger.lib'
import { connectToDB } from '../config/database'
import {
  CONSTANTS,
  END_POINT,
  HTTP_STATUS_CODE
} from '../types/shared.interface'
import { userRouter } from '../routes/userRoutes'
import { queryRouter } from '../routes/queryRoutes'
import { ClientServerInterface } from '../types/server.interface'
import { taskRouter } from '../routes/taskRoutes'
import { redisConnector } from '../config/redisClient'

class ClientServer implements ClientServerInterface.IClientServer {
  private app: Application
  private port: string

  constructor() {
    dotenv.config()
    this._validateEnv()
    this.app = express()
    this.port = process.env.PORT!
    this._initializeMiddlewares()
    this._initializeRoutes()
    this._initializeSwagger()
  }

  private _validateEnv() {
    return ClientServerInterface.validateEnvVars(
      ClientServerInterface.envConfig
    )
  }

  private _initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(helmet())
    this.app.use(morgan('combined'))
  }

  private _initializeSwagger() {
    setupSwagger(this.app)
  }

  private _initializeRoutes() {
    this.app.get(ClientServerInterface.END_POINT.HEALTH_CHECK, (_req, res) => {
      res.send({
        status: HTTP_STATUS_CODE.OK,
        message: ClientServerInterface.SERVER_MESSAGE.HEALTH_CHECK_RESPONSE
      })
    })
    this.app.use(END_POINT.BASE_URL, userRouter.getRouter())
    this.app.use(END_POINT.BASE_URL, queryRouter.getRouter())
    this.app.use(END_POINT.BASE_URL, taskRouter.getRouter())
  }

  private _initializeDBConection() {
    return connectToDB.connect()
  }

  private _initializeRedis() {
    return redisConnector.connect()
  }

  public async start() {
    try {
      await this._initializeDBConection()
      await this._initializeRedis()
      Logger.info(ClientServerInterface.SERVER_MESSAGE.CONNECTION_SUCCESS)
      this.app.listen(this.port, () => {
        Logger.info(`Server is running on port ${this.port}`)
      })
    } catch (err) {
      Logger.error('Error connecting to the database:', err)
      process.exit(CONSTANTS.ONE)
    }
  }
}

export const AppServer = new ClientServer()
