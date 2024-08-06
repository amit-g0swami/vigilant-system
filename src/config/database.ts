import mongoose from 'mongoose'
import { Logger } from '../logger/logger.lib'

mongoose.set('strictQuery', false)
const DB_CONNECTION_URL = process.env.DB_URL as string

namespace DatabaseConnectorInterface {
  export enum DATABASE_MESSAGE {
    CONNECTION_SUCCESS = 'Connected to MongoDB'
  }

  export interface IDatabaseConnector {
    connect(): Promise<void>
  }
}

class DatabaseConnector
  implements DatabaseConnectorInterface.IDatabaseConnector
{
  private dbUrl: string

  constructor(dbUrl: string) {
    this.dbUrl = dbUrl
  }

  public async connect() {
    try {
      await mongoose.connect(this.dbUrl)
      Logger.info(
        DatabaseConnectorInterface.DATABASE_MESSAGE.CONNECTION_SUCCESS
      )
    } catch (error) {
      Logger.error('Error connecting to MongoDB:', error)
    }
  }
}

export const connectToDB = new DatabaseConnector(DB_CONNECTION_URL)
