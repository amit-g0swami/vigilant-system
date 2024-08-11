export namespace ClientServerInterface {
  export const envConfig: ClientServerInterface.IEnvConfig = {
    DB_CONNECTION_URL: process.env.DB_URI!,
    PORT: process.env.PORT!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_KEY: process.env.JWT_KEY!,
    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    EMAIL_HOST: process.env.EMAIL_HOST!,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE!,
    NODE_ENV: process.env.NODE_ENV!,
    REDIS_URL: process.env.REDIS_URL!
  }

  export enum SERVER_MESSAGE {
    CONNECTION_SUCCESS = 'Connected to the database',
    HEALTH_CHECK_RESPONSE = 'Hello World!'
  }

  export interface IEnvConfig {
    DB_CONNECTION_URL: string
    PORT: string
    JWT_SECRET: string
    JWT_KEY: string
    EMAIL_USER: string
    EMAIL_PASS: string
    EMAIL_HOST: string
    EMAIL_SERVICE: string
    NODE_ENV: string
    REDIS_URL: string
  }

  export const requiredEnvVars: (keyof IEnvConfig)[] = [
    'DB_CONNECTION_URL',
    'JWT_SECRET',
    'JWT_KEY',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_HOST',
    'EMAIL_SERVICE',
    'NODE_ENV',
    'REDIS_URL'
  ]

  export const validateEnvVars = (envVars: IEnvConfig): void => {
    requiredEnvVars.forEach((key) => {
      if (!envVars[key]) {
        throw new Error(
          `Error: ${key} is not defined in the environment variables.`
        )
      }
    })
  }

  export enum END_POINT {
    HEALTH_CHECK = '/'
  }

  export interface IClientServer {
    start(): void
  }
}
