export namespace ClientServerInterface {
  export enum SERVER_MESSAGE {
    CONNECTION_SUCCESS = 'Connected to the database'
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
  }

  export const requiredEnvVars: (keyof IEnvConfig)[] = [
    'DB_CONNECTION_URL',
    'JWT_SECRET',
    'JWT_KEY',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_HOST',
    'EMAIL_SERVICE',
    'NODE_ENV'
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

  export interface IClientServer {
    start(): void
  }
}
