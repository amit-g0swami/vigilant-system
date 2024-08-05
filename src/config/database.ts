import mongoose from 'mongoose'
import { Logger } from '../logger/logger.lib'

mongoose.set('strictQuery', false)
const dbUrl = process.env.DB_URL as string

namespace DatabaseConnectorInterface {
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
      Logger.info('Connected to MongoDB')
    } catch (error) {
      Logger.error('Error connecting to MongoDB:', error)
    }
  }
}

export const connectToDB = new DatabaseConnector(dbUrl)
