import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupSwagger } from '../swagger'
import { Logger } from '../logger/logger.lib'
import { connectToDB } from '../config/database'
import { CONSTANTS, END_POINT } from '../types/shared.interface'
import { userRouter } from '../routes/userRoutes'
import { queryRouter } from '../routes/queryRoutes'

dotenv.config()
const defaultPort = 5001

namespace ClientServerInterface {
  export enum SERVER_MESSAGE {
    CONNECTION_SUCCESS = 'Connected to the database'
  }

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
    this.app.use(END_POINT.BASE_URL, userRouter.getRouter())
    this.app.use(END_POINT.BASE_URL, queryRouter.getRouter())
  }

  public async start() {
    try {
      await connectToDB.connect()
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
