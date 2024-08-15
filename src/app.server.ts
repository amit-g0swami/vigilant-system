import fs from 'fs'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import moment from 'moment'
import rfs from 'rotating-file-stream'
import responseTime from 'response-time'
import express, { Application } from 'express'
import { setupSwagger } from './swagger'
import { Logger } from './logger/logger.lib'
import {
  CONSTANTS,
  END_POINT,
  ERROR_MESSAGE,
  HTTP_STATUS_CODE
} from './shared/shared.interface'
import { ClientServerInterface } from './app.interface'
import { queryRouter, taskRouter, userRouter } from './apis'
import { connectToDB, connectToPostgresDB, redisConnector } from './config'

dotenv.config()

class ClientServer implements ClientServerInterface.IClientServer {
  private app: Application
  private port: string

  constructor(DB_URL: string) {
    this._validateEnv()
    this.app = express()
    this.port = DB_URL
    this._initializeMiddlewares()
    this._initializeRoutes()
    this._initializeSwagger()
    this._initializeErrorHandling()
  }

  private _validateEnv() {
    return ClientServerInterface.validateEnvVars(
      ClientServerInterface.envConfig
    )
  }

  private _initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: '50mb',
        parameterLimit: 50000
      })
    )
    this.app.use(helmet())
    this._initializeLogging()
    this.app.use(responseTime())
    this.app.use(express.static(path.join(__dirname, 'assets')))
    this.app.use(express.static('public'))
  }

  private _initializeLogging() {
    const logDirectory = path.join(
      __dirname,
      '/assets/logs/',
      moment().format('DD-MM-YYYY')
    )

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true })
    }

    const accessLogStream = rfs.createStream('access.log', {
      interval: '1d', // rotate daily
      path: logDirectory
    })

    this.app.use(morgan('combined', { stream: accessLogStream }))
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

  private _initializePostgresConnection() {
    return connectToPostgresDB.connect()
  }

  private _initializeRedis() {
    return redisConnector.connect()
  }

  private _initializeErrorHandling() {
    this.app.use((err, res) => {
      Logger.error(`Error: ${err}`, err)
      res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR })
    })
  }

  public async start() {
    try {
      await this._initializeDBConection() // mysql
      await this._initializePostgresConnection() // postgresql
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

const DB_URL = process.env.PORT!
export const AppServer = new ClientServer(DB_URL)
