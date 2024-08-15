import { Dialect } from 'sequelize'

export namespace PostgresQLConnectorInterface {
  export enum DATABASE_MESSAGE {
    CONNECTION_SUCCESS = 'Connection has been established successfully.'
  }

  export enum ENV_TYPE {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test'
  }

  export interface IConfig {
    database: string
    username: string
    password: string
    host: string
    port: number
    dialect: Dialect
    dialectOptions?: object
    logging?: boolean | ((sql: string, timing?: number) => void)
    define?: object
  }

  export interface IDatabaseConnector {
    connect(): Promise<void>
  }
}
