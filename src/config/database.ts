import mongoose from 'mongoose'
import { Logger } from '../logger/logger.lib'
import { DatabaseConnectorInterface } from '../types/db.interface'

const DB_CONNECTION_URL = process.env.DB_URL!

class DatabaseConnector
  implements DatabaseConnectorInterface.IDatabaseConnector
{
  private dbUrl: string

  constructor(dbUrl: string) {
    mongoose.set('strictQuery', false)
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
