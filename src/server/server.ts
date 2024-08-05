import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from '../routes/userRoutes'
import { setupSwagger } from '../swagger'
import { Logger } from '../logger/logger.lib'
import { connectToDB } from '../config/database'
import { CONSTANTS, END_POINT } from '../types/shared.interface'

dotenv.config()
const defaultPort = 5001

namespace ClientServerInterface {
  export interface IClientServer {
    start(): void
  }
}

class ClientServer implements ClientServerInterface.IClientServer {
  private app: Application
  private port: string | number

  constructor() {
    this.app = express()
    this.port = process.env.PORT || defaultPort

    this._initializeMiddlewares()
    this._initializeRoutes()
    this._initializeSwagger()
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
    this.app.get('/', (_req, res) => {
      res.send('Hello World!')
    })
    this.app.use(END_POINT.BASE_URL, userRouter)
  }

  public start() {
    connectToDB
      .connect()
      .then(() => {
        Logger.info('Connected to the database')
      })
      .catch((err) => {
        Logger.error('Error connecting to the database:', err)
        process.exit(CONSTANTS.ONE)
      })
    this.app.listen(this.port, () => {
      Logger.info(`Server is running on port ${this.port}`)
    })
  }
}

export const AppServer = new ClientServer()
