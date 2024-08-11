import { RedisClientType } from 'redis'

export namespace RedisConnectorInterface {
  export const REDIS_MESSAGE = {
    CONNECTION_SUCCESS: 'Connected to Redis'
  }

  export interface IRedisConnector {
    connect(): Promise<void>
    getClient(): RedisClientType
  }
}
