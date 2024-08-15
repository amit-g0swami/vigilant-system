import { Sequelize } from 'sequelize'
import { PostgresQLConnectorInterface } from './postgres.interface'
import { Logger } from '../../logger/logger.lib'

class PostgresDatabaseConnector
  implements PostgresQLConnectorInterface.IDatabaseConnector
{
  private sequelize: Sequelize

  constructor(
    private config: PostgresQLConnectorInterface.IConfig,
    private logger: typeof Logger
  ) {
    this.sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        logging: config.logging,
        define: config.define
      }
    )
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate()
      this.logger.info(
        PostgresQLConnectorInterface.DATABASE_MESSAGE.CONNECTION_SUCCESS
      )
    } catch (error) {
      this.logger.error('Error connecting to PostgreSQL:', error)
    }
  }
}

class ConfigProvider {
  public static getConfig(): PostgresQLConnectorInterface.IConfig {
    const config: PostgresQLConnectorInterface.IConfig = {
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      dialect: 'postgres',
      dialectOptions: {},
      logging: false,
      define: {}
    }

    if (
      process.env.NODE_ENV !== PostgresQLConnectorInterface.ENV_TYPE.DEVELOPMENT
    ) {
      config.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }

    return config
  }
}

export const connectToPostgresDB = new PostgresDatabaseConnector(
  ConfigProvider.getConfig(),
  Logger
)
